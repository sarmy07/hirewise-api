import { Application } from 'src/application/entities/application.entity';
import { ExperienceLevel } from 'src/common/enums/experience-level.enum';
import { JobType } from 'src/common/enums/job-type.enum';
import { Company } from 'src/company/entities/company.entity';
import { Skill } from 'src/skill/entities/skill.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('jobs')
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ nullable: true })
  location: string;

  @Column({
    type: 'enum',
    enum: JobType,
  })
  type: JobType;

  @Column({
    type: 'enum',
    enum: ExperienceLevel,
  })
  experienceLevel: ExperienceLevel;

  @Column({
    type: 'int',
    nullable: true,
  })
  salaryMin: number;

  @Column({
    type: 'int',
    nullable: true,
  })
  salaryMax: number;

  @Column({ default: true })
  isOpen: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Company, (c) => c.jobs, { onDelete: 'CASCADE' })
  company: Company;

  @OneToMany(() => Application, (a) => a.job)
  applications: Application[];

  @ManyToMany(() => Skill, (s) => s.jobs)
  @JoinTable({ name: 'job_skills' })
  skills: Skill[];
}
