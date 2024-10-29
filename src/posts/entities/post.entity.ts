import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Image } from '../../images/entities/image.entity';
import postType from '../types/post-types';

@Entity({ name: 'posts' })
export class Post {
  @PrimaryGeneratedColumn('uuid')
  postID: string;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'user' })
  user: User;

  @Column()
  content: string;

  @ManyToMany(() => User, (user) => user.likes)
  @JoinTable()
  likes: User[];

  @Column({ default: 0 })
  likeCount: number;

  @Column()
  type: postType;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateCreated: Date;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @OneToMany(() => Image, (image) => image.post)
  images: Image[];
}
