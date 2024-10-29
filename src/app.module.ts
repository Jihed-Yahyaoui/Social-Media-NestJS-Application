import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { AuthModule } from './auth/auth.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ImagesModule } from './images/images.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      database: 'test',
      host: 'localhost',
      username: 'root',
      port: 3306,
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    PostsModule,
    CommentsModule,
    AuthModule,
    NotificationsModule,
    ImagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
