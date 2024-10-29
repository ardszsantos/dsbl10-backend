import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment/comment';
import { Post } from '../post/entities/post/post';
import { User } from '../user/entities/user/user';
import { NotificationsModule } from '../notifications/notifications.module'; // Import this

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Post, User]), NotificationsModule], // Add NotificationsModule here
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
