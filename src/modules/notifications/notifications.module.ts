import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification/notification';
import { NotificationService } from './notifications.service';
import { NotificationController } from './notifications.controller';
import { NotificationGateway } from './notificationGateway/notification.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationGateway],
  exports: [NotificationService, NotificationGateway], // Export the gateway
})
export class NotificationsModule {}