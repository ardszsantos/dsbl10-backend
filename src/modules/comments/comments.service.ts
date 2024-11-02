import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
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
  private readonly logger = new Logger(CommentsService.name);

  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly notificationsGateway: NotificationGateway,
    private readonly notificationService: NotificationService,
  ) {}

  // src/modules/comments/comments.service.ts
  async create(createCommentDto: CreateCommentDto, userId: number): Promise<Comment> {
    const { content, postId } = createCommentDto;

    // Find the post and ensure we get the author relationship
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['author'],
    });
    if (!post) throw new NotFoundException(`Post with id ${postId} not found`);

    // Log to confirm we have the correct post author
    this.logger.log(`Commenter ID: ${userId}`);
    this.logger.log(`Post Author ID (should receive the notification): ${post.author.id}`);

    // Create and save the comment
    const comment = this.commentsRepository.create({
      content,
      post,
      user: { id: userId }, // The commenter
    });
    const savedComment = await this.commentsRepository.save(comment);

    // Pass post.author to ensure the notification goes to the post author, not the commenter
    const notification = await this.notificationService.createNotificationForComment(
      post.author,  // <-- Post author, not commenter
      post
    );

    // Emit a real-time WebSocket notification to the post author
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
