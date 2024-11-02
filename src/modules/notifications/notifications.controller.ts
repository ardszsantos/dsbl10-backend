import { Controller, Get, Patch, Param, ParseIntPipe, Req, UseGuards, Logger, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationService } from './notifications.service';
import { Notification as NotificationEntity } from './entities/notification/notification';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('notifications')
export class NotificationController {
  private readonly logger = new Logger(NotificationController.name);

  constructor(private readonly notificationService: NotificationService) {}

  /**
   * Retrieves all notifications for the currently logged-in user.
   * @returns An array of Notification entities for the logged-in user.
   */
  @Get()
  @ApiOperation({ summary: 'Get all notifications for the logged-in user' })
  async getUserNotifications(@Req() req): Promise<NotificationEntity[]> {
    const userId = req.user.id;
    this.logger.log(`Request received to fetch notifications for user ${userId}`);
    const notifications = await this.notificationService.getUserNotifications(userId);
    this.logger.log(`Returning ${notifications.length} notifications for user ${userId}`);
    return notifications;
  }

  /**
   * Sends a test notification to the specified user for testing purposes.
   * @param userId The ID of the user to receive the test notification.
   */
  @Get('/test/:userId')
  @ApiOperation({ summary: 'Send a test notification to a user' })
  async sendTestNotification(@Param('userId', ParseIntPipe) userId: number): Promise<{ message: string }> {
    this.logger.log(`Request received to send test notification to user ${userId}`);
    await this.notificationService.sendTestNotification(userId);
    return { message: `Test notification sent to user ${userId}` };
  }

  /**
   * Marks a specific notification as read for the logged-in user.
   * @param id The ID of the notification to mark as read.
   */
  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark a notification as read' })
  async markAsRead(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    this.logger.log(`Request received to mark notification ${id} as read`);
    await this.notificationService.markAsRead(id);
    this.logger.log(`Notification ${id} marked as read`);
    return { message: `Notification ${id} marked as read` };
  }


  @Delete()
  @ApiOperation({ summary: 'Delete all notifications for the logged-in user' })
  async deleteAllUserNotifications(@Req() req): Promise<{ message: string }> {
    const userId = req.user.id;
    this.logger.log(`Request received to delete all notifications for user ${userId}`);
    await this.notificationService.deleteAllUserNotifications(userId);
    this.logger.log(`All notifications for user ${userId} deleted`);
    return { message: 'All notifications deleted' };
  }

}
