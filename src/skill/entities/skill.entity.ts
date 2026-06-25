import { Job } from 'src/job/entities/job.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('skills')
export class Skill {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => User, (u) => u.skills)
  users: User[];

  @ManyToMany(() => Job, (j) => j.skills)
  jobs: Job[];
}
