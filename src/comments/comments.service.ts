import { UsersService } from './../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { Post } from 'src/posts/entities/post.entity';
import { PostsService } from 'src/posts/posts.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    private postService: PostsService,
    private usersService: UsersService,
  ) {}
  async create(
    userID: string,
    postID: string,
    createCommentDto: CreateCommentDto,
  ) {
    // Get the user who created the comment and the post that was commented
    const [commentedPost, commentingUser] = await Promise.all([
      this.postService.findOne(postID, {
        relations: ['comments'],
      }),
      this.usersService.findOne(userID),
    ]);

    // Save the comment with user and post as relations
    await this.commentsRepository.save({
      content: createCommentDto.content,
      post: commentedPost,
      user: commentingUser,
    });
  }

  findAll() {
    return `This action returns all comments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
