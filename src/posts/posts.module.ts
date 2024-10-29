import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { ImagesService } from 'src/images/images.service';
import { Image } from 'src/images/entities/image.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { NotificationsService } from 'src/notifications/notifications.service';
import { Notification } from 'src/notifications/entities/notification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    TypeOrmModule.forFeature([Image]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Notification]),
  ],
  controllers: [PostsController],
  providers: [
    PostsService,
    ImagesService,
    AuthService,
    UsersService,
    NotificationsService,
    JwtService,
  ],
})
export class PostsModule {}
