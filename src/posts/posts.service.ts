import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { ImagesService } from 'src/images/images.service';
import { User } from 'src/users/entities/user.entity';
import { postPaginationSize } from 'src/common/constants/pagination-constants';
import { NotificationsService } from 'src/notifications/notifications.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private imagesService: ImagesService,
    private notificationsService: NotificationsService,
    private usersService: UsersService,
  ) {}
  async create(createPostDto: CreatePostDto, userID: string) {
    const { content, type, images } = createPostDto;
    // Find user
    const postingUser = await this.usersService.findOne(userID, {
      relations: ['followers'],
    });

    // Create post
    const createdPost = await this.postsRepository.save({
      user: postingUser,
      content,
      type,
      images: [],
      comments: [],
      likes: [],
    });

    // Loop through images and add them to DB
    if (images && images.length > 0) {
      const imageEntities = await this.imagesService.create(
        { images },
        createdPost,
      );

      // Add images to the post Entity
      createdPost.images.push(...imageEntities);
      await this.postsRepository.save(createdPost);
    }

    // Send notifications to connected users that follow the user who
    // created the post
    const userFollowers = postingUser.followers;

    for (const follower of userFollowers) {
      this.notificationsService.create({
        originID: postingUser.userID,
        receiverID: follower.userID,
        type: 'followed-added-post',
      });
    }

    return createdPost;
  }

  async findAll(page: number) {
    const skip = (page - 1) * postPaginationSize;
    const posts = await this.postsRepository.find({
      take: postPaginationSize,
      skip,
      relations: ['user'],
    });
    return posts;
  }

  async findOne(id: string, options?: FindOneOptions<Post>) {
    const post = await this.postsRepository.findOne({
      where: { postID: id },
      ...options,
    });
    if (!post) throw new NotFoundException('Post Not Found');
    return post;
  }

  async likePost(postID: string, userID: string) {
    // Get the liked post and the user from the DB
    const [likingUser, likedPost] = await Promise.all([
      this.usersService.findOne(userID, {
        relations: ['likes'],
      }),
      this.findOne(postID, {
        relations: ['likes', 'user'],
      }),
    ]);

    // Check if the user already liked this post
    if (likedPost.likes.some((user) => user.userID === userID))
      throw new BadRequestException('You already liked this post!');
    // Add a like to the post, this also adds a like to the user entity automatically
    likedPost.likes.push(likingUser);
    likedPost.likeCount++;

    await this.postsRepository.save(likedPost);

    // Send a notification to the owner of the post
    this.notificationsService.create({
      originID: likingUser.userID,
      receiverID: likedPost.user.userID,
      type: 'like',
    });
  }
  async unlikePost(postID: string, userID: string) {
    // Get the unliked post and the user from the DB
    let unlikedPost = await this.findOne(postID, {
      relations: ['likes', 'user'],
    });

    // Check if the user already liked this post
    if (unlikedPost.likes.every((user) => user.userID !== userID))
      throw new BadRequestException('You already do not like this post!');

    // Remove the like to the post, this also remove the like to the user entity automatically
    unlikedPost.likes = unlikedPost.likes.filter(
      (user) => user.userID !== userID,
    );
    unlikedPost.likeCount--;

    await this.postsRepository.save(unlikedPost);
  }
}
