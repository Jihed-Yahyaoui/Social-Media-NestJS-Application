import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { NotificationsService } from './notifications.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationsGateway {
  constructor(private notificationsService: NotificationsService) {}

  // When a user signs in, save their socket instance and userID
  @SubscribeMessage('connected')
  handleConnected(clientSocket: Socket, payload: { userID: string }) {
    this.notificationsService.handleConnection(clientSocket, payload.userID);
  }
  // When a user signs out, delete their socket instance and userID
  @SubscribeMessage('disconnected')
  handleDisconnected(_, payload: { userID: string }) {
    this.notificationsService.handleDisconnection(payload.userID);
  }
  @SubscribeMessage('markAsRead')
  markNotificationAsRead(_, payload: { notificationID: string }) {
    this.notificationsService.markNotificationAsRead(payload.notificationID);
  }
}
