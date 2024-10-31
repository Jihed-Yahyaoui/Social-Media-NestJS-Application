import { User } from 'src/users/entities/user.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import notificationType from '../types/notification.types';

@Entity({ name: 'notifications' })
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  notificationID: string;

  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user.sendNotifications)
  originUser: User;

  @ManyToOne(() => User, (user) => user.receivedNotifications)
  receiverUser: User;

  @Column()
  type: notificationType;

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn()
  dateCreated: Date;

  @Column({ default: null })
  postID?: string;
}
