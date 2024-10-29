import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // Adjust to your frontend URL for production
  },
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // Method to send notifications to a specific user room
  sendNotification(userId: number, message: string) {
    this.server.to(`user-${userId}`).emit('newNotification', { message });
  }

  // Handler to add users to their specific notification rooms
  @SubscribeMessage('join')
  handleJoinRoom(client: Socket, userId: number) {
    client.join(`user-${userId}`);
    console.log(`User ${userId} joined their notification room`);
  }
}
