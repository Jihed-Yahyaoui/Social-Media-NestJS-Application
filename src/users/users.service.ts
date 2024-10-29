import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @Inject(forwardRef(() => NotificationsService)) // Circular dependency workaround
    private notificationsService: NotificationsService,
  ) {}

  async findAll() {
    return await this.usersRepository.find({
      relations: ['followers', 'following'],
    });
  }

  async findOne(id: string, options?: FindOneOptions<User>) {
    const user = await this.usersRepository.findOne({
      where: { userID: id },
      ...options,
    });

    if (!user) throw new NotFoundException('User Not Found');
    return user;
  }

  async follow(followerID: string, followedID: string) {
    if (followedID === followerID)
      throw new BadRequestException('You cannot follow yourself!');

    // Get follower user and followed user
    const [followerUser, followedUser] = await Promise.all([
      this.findOne(followerID, { relations: ['following'] }), // This user follows the one below
      this.findOne(followedID, { relations: ['followers'] }),
    ]);
    // Check if followedUser is already followed
    if (followerUser.following.some((user) => user.userID === followedID))
      throw new BadRequestException('This user is already followed!');

    // Adds the followed to the follower user's list of followed users
    // Example: User A follows User B -> add User B to the list of User A followed users
    followerUser.following.push(followedUser);

    followerUser.followingCount++;
    followedUser.followersCount++;

    // Save changes to DB
    await this.usersRepository.save([followerUser, followedUser]);

    await this.notificationsService.create({
      originID: followerID,
      receiverID: followedID,
      type: 'user-follow',
    });

    return 'Created';
  }

  async unfollow(followerID: string, followedID: string) {
    if (followedID === followerID)
      throw new BadRequestException('You cannot unfollow yourself!');

    // Get follower user and followed user
    const [followerUser, followedUser] = await Promise.all([
      this.findOne(followerID, { relations: ['following'] }), // This user follows the one below
      this.findOne(followedID, { relations: ['followers'] }),
    ]);

    // Check if followedUser is already followed
    if (followerUser.following.every((user) => user.userID !== followedID))
      throw new BadRequestException('This user is not followed!');

    // Remove the followed from the follower user's list of followed users
    // Example: User A unfollows User B -> remove User B from the list of User A followed users
    followerUser.following = followerUser.following.filter(
      (user) => user.userID !== followedID,
    );

    followerUser.followingCount--;
    followedUser.followersCount--;

    // Save changes to DB
    return await this.usersRepository.save([followerUser, followedUser]);
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
