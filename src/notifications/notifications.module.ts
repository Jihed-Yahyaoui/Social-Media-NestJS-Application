import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsGateway } from './notifications.gateway';
import { Notification } from './entities/notification.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [NotificationsService, NotificationsGateway, UsersService],
})
export class NotificationsModule {}
