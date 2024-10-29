import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Entity({ name: 'skills' })
export class Skill {
  @PrimaryGeneratedColumn('uuid')
  skillID: string;

  @ManyToOne(() => User, (user) => user.skills)
  @JoinColumn({ name: 'user' })
  user: User;

  @Column()
  skillName: string;
}
