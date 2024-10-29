import { IsIn, IsNotEmpty, IsUUID } from 'class-validator';
import notificationType from '../types/notification.types';

export class CreateNotificationDto {
  @IsUUID()
  originID: string;

  @IsUUID()
  receiverID: string;

  @IsIn([
    'like',
    'comment',
    'share',
    'followed-added-post',
    'followed-added-experience',
    'user-follow',
  ])
  @IsNotEmpty()
  type: notificationType;
}
