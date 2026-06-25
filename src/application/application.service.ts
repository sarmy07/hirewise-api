import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Application } from './entities/application.entity';
import { Repository } from 'typeorm';
import { Job } from 'src/job/entities/job.entity';
import { application } from 'express';
import { ApplicationStatus } from 'src/common/enums/application.status.enum';
import { groupBy } from 'rxjs';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepo: Repository<Application>,
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
  ) {}

  async apply(userId: string, dto: CreateApplicationDto) {
    const job = await this.jobRepository.findOne({
      where: {
        id: dto.jobId,
        isOpen: true,
      },
    });

    if (!job) throw new NotFoundException('job not found or is no longer open');

    const alreadyApplied = await this.applicationRepo.findOne({
      where: {
        user: {
          id: userId,
        },
        job: {
          id: dto.jobId,
        },
      },
    });
    if (alreadyApplied)
      throw new ConflictException('You have already applied for this job');

    const application = this.applicationRepo.create({
      coverLetter: dto.coverLetter,
      user: { id: userId },
      job: { id: dto.jobId },
    });

    await this.applicationRepo.save(application);
    return {
      message: 'Application submitted successfully',
      application,
    };
  }

  // get all job seeker's applications
  async getMyApplications(userId: string) {
    return this.applicationRepo
      .createQueryBuilder('application')
      .innerJoin('application.user', 'user')
      .innerJoinAndSelect('application.job', 'job')
      .innerJoinAndSelect('job.company', 'company')
      .innerJoin('company.owner', 'owner')
      .leftJoinAndSelect('job.skills', 'skill')
      .where('user.id = :userId', { userId })
      .orderBy('application.appliedAt', 'DESC')
      .getMany();
  }

  // get single job seeker application
  async getMyApplication(userId: string, applicationId: string) {
    const application = await this.applicationRepo
      .createQueryBuilder('application')
      .innerJoin('application.user', 'user')
      .innerJoinAndSelect('application.job', 'job')
      .innerJoinAndSelect('job.company', 'company')
      .leftJoinAndSelect('job.skills', 'skill')
      .where('application.id = :applicationId', { applicationId })
      .andWhere('owner.id = :userId', { userId })
      .getOne();

    if (!application) throw new NotFoundException('appliacation not found');

    return application;
  }

  // employer views all applications for a single job
  async getJobApplication(jobId: string, userId: string) {
    const job = await this.jobRepository
      .createQueryBuilder('job')
      .innerJoin('job.company', 'company')
      .innerJoin('company.owner', 'owner')
      .where('jobId = :jobId', { jobId })
      .andWhere('owner.id = :userId', { userId })
      .getOne();

    if (!job) throw new NotFoundException();

    return this.applicationRepo
      .createQueryBuilder('application')
      .innerJoinAndSelect('application.user', 'user')
      .leftJoinAndSelect('application.skills', 'skill')
      .innerJoin('application.job', 'job')
      .where('job.id = :jobId', { jobId })
      .orderBy('application.appliedAt', 'DESC')
      .getMany();
  }

  async withdraw(applicationId: string, userId: string) {
    const application = await this.applicationRepo
      .createQueryBuilder('application')
      .innerJoin('appliaction.user', 'user')
      .where('application.id = :applicationId', { applicationId })
      .andWhere('owner.id = :userId', { userId })
      .getOne();

    if (!application) throw new NotFoundException();

    if (application.status !== ApplicationStatus.PENDING)
      throw new ForbiddenException(
        'only pending applications can be withdrawn',
      );

    await this.applicationRepo.remove(application);
    return {
      message: 'Application withdrawn successfully',
    };
  }

  async updateApplicationStatus(
    applicationId: string,
    userId: string,
    dto: UpdateApplicationDto,
  ) {
    const application = await this.applicationRepo
      .createQueryBuilder('application')
      .innerJoinAndSelect('application.user', 'user')
      .innerJoin('application.job', 'job')
      .innerJoin('job.company', 'company')
      .innerJoin('company.owner', 'owner')
      .where('application.id = :applicationId', { applicationId })
      .andWhere('owner.id = :userId', { userId })
      .getOne();

    if (!application) throw new NotFoundException('application not found');

    application.status = dto.status;
    await this.applicationRepo.save(application);

    return {
      message: `Application has been updated to ${dto.status}`,
    };
  }

  async getStats(userId: string) {
    const stats = await this.applicationRepo
      .createQueryBuilder('application')
      .innerJoin('application.job', 'job')
      .innerJoin('job.company', 'company')
      .innerJoin('company.owner', 'owner')
      .select('application.status', 'status')
      .addSelect('COUNT(application.id)', 'count')
      .where('owner.id = :userId', { userId })
      .groupBy('application.status')
      .getRawMany();

    const totalJobs = await this.jobRepository
      .createQueryBuilder('job')
      .innerJoin('job.company', 'company')
      .innerJoin('company.owner', 'owner')
      .where('owner.id = :userId', { userId })
      .getCount();

    const openJobs = await this.jobRepository
      .createQueryBuilder('job')
      .innerJoin('job.company', 'company')
      .innerJoin('company.owner', 'owner')
      .where('owner.id = :userId', { userId })
      .andWhere('job.isOpen = :isOpen', { isOpen: true })
      .getCount();

    return {
      totalJobs,
      openJobs,
      closedJobs: totalJobs - openJobs,
      applicationByStatus: stats.reduce((acc, curr) => {
        acc[curr.status] = Number(curr.count);
        return acc;
      }, {}),
    };
  }
}
