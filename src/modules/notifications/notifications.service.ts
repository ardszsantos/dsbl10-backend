// notifications.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification/notification';
import { User } from '../user/entities/user/user';
import { Post } from '../post/entities/post/post';
import { NotificationGateway } from './notificationGateway/notification.gateway';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    private notificationGateway: NotificationGateway, // Inject NotificationGateway
  ) {}

  /**
   * Creates a notification when a user receives a comment on their post and emits it via WebSocket.
   * @param user The user receiving the notification.
   * @param post The post on which the comment was made.
   * @returns The saved notification entity.
   */
// notifications.service.ts
  async createNotificationForComment(postAuthor: User, post: Post): Promise<Notification> {
    this.logger.log(`Creating notification for post author ID: ${postAuthor.id}`); // This should be the post author

    const notification = this.notificationRepository.create({
      message: `New comment on your post: ${post.title}`,
      user: postAuthor, // Correctly set to post author
      post,
    });
    const savedNotification = await this.notificationRepository.save(notification);

    this.logger.log(`Notification created for post author ID: ${postAuthor.id} on post ${post.id}`);
    
    // Emit the notification to the WebSocket for the post author
    this.notificationGateway.sendNotification(postAuthor.id, savedNotification.message);
    this.logger.log(`Notification emitted to post author ID: ${postAuthor.id} with message: ${savedNotification.message}`);

    return savedNotification;
  }


  async deleteAllUserNotifications(userId: number): Promise<void> {
    this.logger.log(`Deleting all notifications for user ${userId}`);
    await this.notificationRepository.delete({ user: { id: userId } });
    this.logger.log(`All notifications for user ${userId} have been deleted`);
  }

  

  /**
   * Sends a test notification to a specific user for debugging purposes.
   * @param userId The ID of the user to receive the test notification.
   */
  async sendTestNotification(userId: number): Promise<void> {
    const message = 'This is a test notification';
    
    this.logger.log(`Sending test notification to user ${userId}`);
    // Emit the test notification to the user
    this.notificationGateway.sendNotification(userId, message);
    this.logger.log(`Test notification emitted to user ${userId} with message: ${message}`);
  }

  /**
   * Retrieves all notifications for a specific user, ordered by creation date.
   * @param userId The ID of the user whose notifications to retrieve.
   * @returns An array of Notification entities.
   */
  async getUserNotifications(userId: number): Promise<Notification[]> {
    this.logger.log(`Fetching notifications for user ${userId}`);
    const notifications = await this.notificationRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
    this.logger.log(`Retrieved ${notifications.length} notifications for user ${userId}`);
    return notifications;
  }

  /**
   * Marks a notification as read by updating its 'isRead' status.
   * @param notificationId The ID of the notification to mark as read.
   */
  async markAsRead(notificationId: number): Promise<void> {
    this.logger.log(`Marking notification ${notificationId} as read`);
    await this.notificationRepository.update(notificationId, { isRead: true });
    this.logger.log(`Notification ${notificationId} marked as read`);
  }
}
