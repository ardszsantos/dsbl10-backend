import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment/comment';
import { Post } from '../post/entities/post/post';
import { CreateCommentDto } from './dto/create-comment.dto/create-comment.dto';
import { NotificationGateway } from '../notifications/notificationGateway/notification.gateway';
import { NotificationService } from '../notifications/notifications.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly notificationsGateway: NotificationGateway,
    private readonly notificationService: NotificationService,
  ) {}

  // Create a new comment and send notification
  async create(createCommentDto: CreateCommentDto, userId: number): Promise<Comment> {
    const { content, postId } = createCommentDto;

    // Find the post with its author
    const post = await this.postRepository.findOne({ where: { id: postId }, relations: ['author'] });
    if (!post) throw new NotFoundException(`Post with id ${postId} not found`);

    // Create and save the comment
    const comment = this.commentsRepository.create({
      content,
      post,
      user: { id: userId }, // Assuming only the user ID is passed
    });
    const savedComment = await this.commentsRepository.save(comment);

    // Create a notification in the database for the post's author
    const notification = await this.notificationService.createNotificationForComment(post.author, post);

    // Emit a real-time WebSocket notification
    this.notificationsGateway.sendNotification(post.author.id, notification.message);

    return savedComment;
  }

  // Delete a comment
  async delete(commentId: number, userId: number): Promise<void> {
    const comment = await this.commentsRepository.findOne({
      where: { id: commentId },
      relations: ['user'],
    });

    if (!comment) throw new NotFoundException(`Comment with id ${commentId} not found`);

    // Check if the comment belongs to the user
    if (comment.user.id !== userId) {
      throw new ForbiddenException('You are not allowed to delete this comment');
    }

    await this.commentsRepository.remove(comment);
  }

  // Get comments for a post
  async findByPost(postId: number): Promise<Comment[]> {
    return this.commentsRepository.find({
      where: { post: { id: postId } },
      relations: ['user'],
    });
  }
}
