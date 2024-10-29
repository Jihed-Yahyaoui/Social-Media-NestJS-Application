import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from '../../posts/entities/post.entity';

@Entity({ name: 'images' })
export class Image {
  @PrimaryGeneratedColumn('uuid')
  imageID: string;

  @Column()
  data: string;

  @ManyToOne(() => Post, (post) => post.images)
  post: Post;
}
