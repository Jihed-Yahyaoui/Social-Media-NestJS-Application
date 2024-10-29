import roles from 'src/users/types/roles';
import { Comment } from 'src/comments/entities/comment.entity';
import { Experience } from 'src/experiences/entities/experience.entity';
import { Post } from 'src/posts/entities/post.entity';
import { Skill } from 'src/skills/entities/skill.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Notification } from 'src/notifications/entities/notification.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  userID: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: false, default: 'user' })
  role: roles;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateJoined: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @ManyToMany(() => Post, (post) => post.likes)
  likes: Post[];

  @ManyToMany(() => User, (user) => user.following)
  @JoinTable()
  followers: User[];

  @ManyToMany(() => User, (user) => user.followers)
  following: User[];

  @Column()
  followersCount: number;

  @Column()
  followingCount: number;

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Skill, (skill) => skill.user)
  skills: Skill[];

  @OneToMany(() => Experience, (experience) => experience.user)
  experiences: Experience[];

  @OneToMany(() => Notification, (notification) => notification.originUser)
  sendNotifications: Notification[];

  @OneToMany(() => Notification, (notification) => notification.receiverUser)
  receivedNotifications: Notification[];
}
