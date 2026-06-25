import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { In, Repository } from 'typeorm';
import { Company } from 'src/company/entities/company.entity';
import { Skill } from 'src/skill/entities/skill.entity';
import { FilterJobDto } from './dto/filter-job.dto';

@Injectable()
export class JobService {
  @InjectRepository(Job)
  private readonly jobRepository: Repository<Job>;
  @InjectRepository(Company)
  private readonly companyRepo: Repository<Company>;
  @InjectRepository(Skill)
  private readonly skillRepo: Repository<Skill>;

  async create(userId: string, dto: CreateJobDto) {
    const company = await this.companyRepo.findOne({
      where: {
        owner: { id: userId },
      },
    });

    if (!company) throw new ForbiddenException('You do not own this company');

    let skills: Skill[] = [];
    if (dto.skillsIds?.length) {
      skills = await this.skillRepo.find({
        where: {
          id: In(dto.skillsIds),
        },
      });
    }
    const { skillsIds, ...rest } = dto;

    const job = this.jobRepository.create({
      ...rest,
      company,
      skills,
    });

    await this.jobRepository.save(job);
    return job;
  }

  async findAll(filter: FilterJobDto) {
    const {
      title,
      location,
      type,
      experienceLevel,
      salaryMin,
      salaryMax,
      skills,
      companyId,
      page,
      limit,
    } = filter;

    const qb = this.jobRepository
      .createQueryBuilder('job')
      .innerJoinAndSelect('job.company', 'company')
      .leftJoinAndSelect('job.skills', 'skill')
      .where('job.isOpen = :isOpen', { isOpen: true });

    // dynamic filters — each only added if the param exists
    if (title) {
      qb.andWhere('LOWER(job.title) LIKE LOWER(:title)', {
        title: `%${title}%`,
      });
    }

    if (location) {
      qb.andWhere('LOWER(job.location) LIKE LOWER(:location)', {
        location: `%${location}%`,
      });
    }

    if (type) {
      qb.andWhere('job.type = :type', { type });
    }

    if (experienceLevel) {
      qb.andWhere('job.experienceLevel = :experienceLevel', {
        experienceLevel,
      });
    }

    if (salaryMin !== undefined) {
      qb.andWhere('job.salaryMin >= :salaryMin', { salaryMin });
    }

    if (salaryMax !== undefined) {
      qb.andWhere('job.salaryMax <= :salaryMax', { salaryMax });
    }

    if (companyId) {
      qb.andWhere('company.id = :companyId', { companyId });
    }

    // skills filter — job must have ALL the specified skills
    if (skills) {
      const skillIds = skills.split(',').map((id) => id.trim());

      qb.andWhere((subQb) => {
        const sub = subQb
          .subQuery()
          .select('job_skill.jobId')
          .from('job_skills', 'job_skill')
          .where('job_skill.skillId IN (:...skillIds)', { skillIds })
          .groupBy('job_skill.jobId')
          .having('COUNT(DISTINCT job_skill.skillId) = :skillCount', {
            skillCount: skillIds.length,
          })
          .getQuery();

        return `job.id IN ${sub}`;
      });
    }

    // pagination
    const skip = ((page ?? 1) - 1) * (limit ?? 10);

    qb.orderBy('job.createdAt', 'DESC')
      .skip(skip)
      .take(limit ?? 10);

    const [jobs, total] = await qb.getManyAndCount();

    return {
      data: jobs,
      meta: {
        total,
        page: page ?? 1,
        limit: limit ?? 10,
        totalPages: Math.ceil(total / (limit ?? 10)),
      },
    };
  }

  async findOne(jobId: string) {
    const job = await this.jobRepository
      .createQueryBuilder('job')
      .innerJoinAndSelect('job.company', 'company')
      .innerJoinAndSelect('company.owner', 'owner')
      .leftJoinAndSelect('job.skills', 'skill')
      .leftJoin('job.applications', 'application')
      .addSelect('COUNT(DISTINCT application.id)', 'applicationCount')
      .where('job.id = :jobId', { jobId })
      .groupBy('job.id')
      .addGroupBy('company.id')
      .addGroupBy('skill.id')
      .getRawAndEntities();

    if (!job.entities[0]) throw new NotFoundException('job not found');

    return {
      ...job.entities[0],
      applicationsCount: Number(job.raw[0]?.applicationsCount ?? 0),
    };
  }

  async update(jobId: string, userId: string, dto: UpdateJobDto) {
    const job = await this.jobRepository
      .createQueryBuilder('job')
      .innerJoin('job.company', 'company')
      .innerJoin('company.owner', 'owner')
      .leftJoinAndSelect('job.skills', 'skill')
      .where('job.id = :jobId', { jobId })
      .andWhere('owner.id = :userId', { userId })
      .getOne();

    if (!job) throw new NotFoundException('Job not found');

    if (dto.skillsIds?.length) {
      const skills = await this.skillRepo.find({
        where: {
          id: In(dto.skillsIds),
        },
      });
      job.skills = skills;
    }

    const { skillsIds, ...rest } = dto;
    Object.assign(job, rest);
    await this.jobRepository.save(job);
    return job;
  }

  async remove(jobId: string, userId: string) {
    const job = await this.jobRepository.findOne({
      where: {
        id: jobId,
        company: {
          owner: {
            id: userId,
          },
        },
      },
    });
    if (!job)
      throw new ForbiddenException(
        'You dont own the comapny that created this job',
      );

    await this.jobRepository.remove(job);
    return {
      message: 'Job removed successfully',
    };
  }

  async toggleOpen(jobId: string, userId: string) {
    // const job = await this.jobRepository
    //   .createQueryBuilder('job')
    //   .innerJoin('job.company', 'company')
    //   .innerJoin('company.owner', 'owner')
    //   .where('job.id = :jobId', { jobId })
    //   .andWhere('owner.id = :userId', { userId })
    //   .getOne();

    const job = await this.jobRepository.findOne({
      where: {
        id: jobId,
        company: {
          owner: {
            id: userId,
          },
        },
      },
    });

    if (!job) throw new NotFoundException('Job not found');

    job.isOpen = !job.isOpen;
    await this.jobRepository.save(job);

    return {
      message: `Job is now ${job.isOpen ? 'Open' : 'Closed'}`,
      isOpen: job.isOpen,
    };
  }

  async getMyJobs(userId: string) {
    return this.jobRepository
      .createQueryBuilder('job')
      .innerJoin('job.company', 'company')
      .innerJoin('company.owner', 'owner')
      .leftJoinAndSelect('job.skills', 'skill')
      .leftJoin('job.applications', 'application')
      .addSelect('COUNT(DISTINCT application.id)', 'applicationsCount')
      .where('owner.id = :userId', { userId })
      .groupBy('job.id')
      .addGroupBy('skill.id')
      .orderBy('job.createdAt', 'DESC')
      .getRawAndEntities();
  }
}
