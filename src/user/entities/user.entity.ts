import { Application } from 'src/application/entities/application.entity';
import { Role } from 'src/common/enums/role.enum';
import { Company } from 'src/company/entities/company.entity';
import { Skill } from 'src/skill/entities/skill.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.SEEKER,
  })
  role: Role;

  @Column({ nullable: true })
  googleId: string;

  @Column({ nullable: true })
  avatar: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => Company, (c) => c.owner)
  company: Company;

  @OneToMany(() => Application, (a) => a.user)
  applications: Application[];

  @ManyToMany(() => Skill, (s) => s.users)
  @JoinTable({ name: 'user_skills' })
  skills: Skill[];

  @Column({
    type: 'varchar',
    nullable: true,
  })
  refreshToken: string | null;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  portofolioUrl: string;
}
