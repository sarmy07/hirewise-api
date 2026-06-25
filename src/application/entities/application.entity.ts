import { ApplicationStatus } from 'src/common/enums/application.status.enum';
import { Job } from 'src/job/entities/job.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.PENDING,
  })
  status: ApplicationStatus;

  @Column('text', { nullable: true })
  coverLetter: string;

  @CreateDateColumn()
  appliedAt: Date;

  @ManyToOne(() => User, (u) => u.applications, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Job, (j) => j.applications, { onDelete: 'CASCADE' })
  job: Job;
}
