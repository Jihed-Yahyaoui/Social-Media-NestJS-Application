import { Post } from 'src/posts/entities/post.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'comments' })
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  commentID: string;

  @ManyToOne(() => Post, (post) => post.comments)
  @JoinColumn({ name: 'post' })
  post: Post;

  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({ name: 'user' })
  user: User;

  @Column()
  content: string;

  @Column()
  dateCreated: Date = new Date();
}
