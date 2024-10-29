import { Notification } from './entities/notification.entity';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Socket } from 'socket.io';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import notificationType from './types/notification.types';

@Injectable()
export class NotificationsService {
  // Users signed in are saved here in order to access their socket details
  static connectedUsers: Map<string, Socket>;

  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @Inject(forwardRef(() => UsersService)) // Circular dependency workaround
    private usersService: UsersService,
  ) {
    NotificationsService.connectedUsers = new Map();
  }

  handleConnection(clientSocket: Socket, userID: string) {
    NotificationsService.connectedUsers.set(userID, clientSocket);
  }

  handleDisconnection(userID: string) {
    NotificationsService.connectedUsers.delete(userID);
  }

  // Create notification content from the origin user's name and notification type
  // For example: "John Doe has liked your post.", "Laura jessie has shared your post"
  generateNotificationText(
    originUserName: string,
    notificationtype: notificationType,
  ) {
    return originUserName + ' ' + notificationtype;
  }

  async create(createNotificationDto: CreateNotificationDto) {
    const { originID, receiverID, type } = createNotificationDto;

    // Get Users: the user who caused the notification to be sent
    // and the user who should receive it
    const [originUser, receiverUser] = await Promise.all([
      this.usersService.findOne(originID),
      this.usersService.findOne(receiverID),
    ]);

    const { firstName, lastName } = originUser;
    const nofiticationContent = this.generateNotificationText(
      firstName + ' ' + lastName,
      type,
    );

    // Create notification with proper content
    await this.notificationRepository.save({
      ...createNotificationDto,
      originUser,
      receiverUser,
      content: nofiticationContent,
    });

    // Send a socket.io message containing the notification
    const receiverUserSocket =
      NotificationsService.connectedUsers.get(receiverID);

    if (receiverUserSocket)
      NotificationsService.connectedUsers.get(receiverID).emit('notification', {
        type,
        nofiticationContent,
      });
  }

  markNotificationAsRead(notificationID: string) {
    this.notificationRepository.update({ notificationID }, { isRead: true });
  }

  findAll() {
    return `This action returns all notifications`;
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return `This action updates a #${id} notification`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
