import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Skill } from './entities/skill.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SkillService {
  constructor(
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
  ) {}

  // async create(dto: CreateSkillDto) {
  //   const existing = await this.skillRepository.findOne({
  //     where: {
  //       name: dto.name,
  //     },
  //   });
  //   if (existing) throw new ConflictException('skill already exists');

  //   const skill = this.skillRepository.create(dto);
  //   await this.skillRepository.save(skill);
  //   return skill;
  // }

  findAllWithQueryBuilder() {
    return this.skillRepository
      .createQueryBuilder('skill')
      .leftJoin('skill.users', 'user')
      .leftJoin('skill.jobs', 'job')
      .addSelect('COUNT(DISTINCT user.id)', 'userCount')
      .addSelect('COUNT(DISTINCT job.id', 'jobCount')
      .groupBy('skill.id')
      .orderBy('skill.name', 'ASC')
      .getRawAndEntities();
  }

  async findAll() {
    return await this.skillRepository.find({
      relations: {
        users: true,
        jobs: true,
      },
    });
  }

  async findOne(id: string) {
    const skill = await this.skillRepository
      .createQueryBuilder('skill')
      .leftJoinAndSelect('skill.jobs', 'job')
      .where('skill.id = :id', { id })
      .getOne();

    if (!skill) throw new NotFoundException('skill not found');

    return skill;
  }

  // update(id: number, updateSkillDto: UpdateSkillDto) {
  //   return `This action updates a #${id} skill`;
  // }

  async remove(id: string) {
    const skill = await this.skillRepository.findOne({
      where: {
        id,
      },
    });
    if (!skill) throw new NotFoundException('skill not found');

    await this.skillRepository.remove(skill);
    return {
      message: 'Skill removed successfully!',
    };
  }
}
