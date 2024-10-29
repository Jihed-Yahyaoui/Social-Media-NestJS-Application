import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Entity({ name: 'experiences' })
export class Experience {
  @PrimaryGeneratedColumn('uuid')
  experienceID: string;

  @ManyToOne(() => User, (user) => user.experiences)
  @JoinColumn({ name: 'user' })
  user: User;

  @Column()
  experienceTitle: string;

  @Column()
  experienceDescription: string;

  @Column()
  experienceFrom: Date;

  @Column()
  experienceTo: Date;
}
