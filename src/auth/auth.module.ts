import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { AuthGuard } from './auth.guard';
import { NotificationsService } from 'src/notifications/notifications.service';
import { Notification } from 'src/notifications/entities/notification.entity';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Notification]),
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService, NotificationsService, AuthGuard],
  exports: [AuthGuard],
})
export class AuthModule {}
