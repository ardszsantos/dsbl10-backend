import { Controller, Get, Patch, Param, ParseIntPipe, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationService } from './notifications.service';
import { Notification as NotificationEntity } from './entities/notification/notification';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @ApiOperation({ summary: 'Get all notifications for the logged-in user' })
  async getUserNotifications(@Req() req): Promise<NotificationEntity[]> {
    const userId = req.user.id;
    return this.notificationService.getUserNotifications(userId);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark a notification as read' })
  async markAsRead(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.notificationService.markAsRead(id);
  }
}
