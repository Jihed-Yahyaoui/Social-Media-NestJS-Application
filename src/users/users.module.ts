import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ExperiencesModule } from '../experiences/experiences.module';
import { SkillsModule } from '../skills/skills.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { NotificationsService } from 'src/notifications/notifications.service';
import { Notification } from 'src/notifications/entities/notification.entity';

@Module({
  imports: [
    ExperiencesModule,
    SkillsModule,
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Notification]),
  ],
  controllers: [UsersController],
  providers: [UsersService, AuthService, JwtService, NotificationsService],
})
export class UsersModule {}
