import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification/notification';
import { User } from '../user/entities/user/user';
import { Post } from '../post/entities/post/post';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async createNotificationForComment(user: User, post: Post): Promise<Notification> {
    const notification = this.notificationRepository.create({
      message: `New comment on your post: ${post.title}`,
      user,
      post,
    });
    return this.notificationRepository.save(notification);
  }

  async getUserNotifications(userId: number): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(notificationId: number): Promise<void> {
    await this.notificationRepository.update(notificationId, { isRead: true });
  }
}
