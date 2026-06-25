import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
  ) {}

  async create(userId: string, dto: CreateCompanyDto) {
    const existing = await this.companyRepo
      .createQueryBuilder('company')
      .innerJoin('company.owner', 'owner')
      .where('owner.id = :userId', { userId })
      .getOne();

    if (existing) throw new ConflictException('You already have a company');

    const company = this.companyRepo.create({
      ...dto,
      owner: { id: userId },
    });

    await this.companyRepo.save(company);
    return company;
  }

  async findAll() {
    return await this.companyRepo
      .createQueryBuilder('company')
      .innerJoin('company.owner', 'owner')
      .leftJoin('company.jobs', 'job')
      .addSelect(['owner.id', 'owner.name', 'owner.email'])
      .addSelect('COUNT(DISTINCT job.id)', 'jobsCount')
      .groupBy('company.id')
      .addGroupBy('owner.id')
      .orderBy('company.name', 'ASC')
      .getRawAndEntities();
  }

  async findOne(id: string) {
    const company = await this.companyRepo
      .createQueryBuilder('company')
      .innerJoin('company.owner', 'owner')
      .leftJoinAndSelect('company.jobs', 'job')
      .addSelect(['owner.id', 'owner.name', 'owner.email'])
      .where('company.id = :id', { id })
      .andWhere('jobs.isOpen =:isOpen', { isOpen: true })
      .getOne();

    if (!company) throw new NotFoundException('Company not found');

    return company;
  }

  async update(companyId: string, userId: string, dto: UpdateCompanyDto) {
    const company = await this.companyRepo
      .createQueryBuilder('company')
      .innerJoin('company.owner', 'owner')
      .where('company.id = :companyId', { id: companyId })
      .andWhere('owner.id = :userId', { id: userId })
      .getOne();

    if (!company) throw new ForbiddenException('You do not own this company');

    // if (company.owner.id !== userId) {
    //   throw new ForbiddenException('You do not own this comapny');
    // }

    Object.assign(company, dto);
    return this.companyRepo.save(company);
  }

  async remove(companyId: string, userId: string) {
    const company = await this.companyRepo
      .createQueryBuilder('company')
      .innerJoin('company.owner', 'owner')
      .where('company.id = :companyId', { companyId })
      .andWhere('owner.id = :userId', { userId })
      .getOne();

    if (!company) throw new ForbiddenException('You do not own this company');
    await this.companyRepo.remove(company);
    return {
      message: 'Company deleted successfully',
    };
  }

  async getMyCompany(userId: string) {
    const company = await this.companyRepo
      .createQueryBuilder('company')
      .innerJoin('company.owner', 'owner')
      .leftJoinAndSelect('company.jobs', 'jobs')
      .leftJoinAndSelect('company.skills', 'skill')
      .leftJoin('company.applications', 'application')
      .addSelect('COUNT(DISTINCT application.id)', 'applicationCount')
      .where('owner.id = :userId', { userId })
      .groupBy('company.id')
      .addGroupBy('job.id')
      .addGroupBy('skill.id')
      .getOne();

    if (company) throw new NotFoundException('You do not have a company yet');
    return company;
  }
}
