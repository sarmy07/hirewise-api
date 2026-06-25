import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Skill } from 'src/skill/entities/skill.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
  ) {}

  async getMe(userId: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.skills', 'skill')
      .where('user.id = :id', { id: userId })
      .select([
        'user.id',
        'user.name',
        'user.email',
        'user.bio',
        'user.location',
        'user.avatar',
        'user.portofolioUrl',
        'user.createdAt',
        'skill.name',
      ])
      .getOne();

    if (!user) throw new NotFoundException('user not found');
    return user;
  }

  async getUserById(id: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.skills', 'skill')
      .where('user.id = :id', { id })
      .select([
        'user.id',
        'user.name',
        'user.role',
        'user.bio',
        'user.location',
        'user.avatar',
        'user.portofolioUrl',
        'user.createdAt',
        'skill.id',
        'skill.name',
      ])
      .getOne();

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async updateMe(userId: string, dto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) return null;

    Object.assign(user, dto);
    await this.userRepository.save(user);

    const { password, refreshToken, ...rest } = user;
    return rest;
  }

  async deleteMe(userId: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) throw new NotFoundException('User not found');

    await this.userRepository.remove(user);
    return {
      message: 'User deleted',
    };
  }

  async addSkill(userId: string, skillId: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.skills', 'skill')
      .where('user.id = :id', { id: userId })
      .getOne();

    if (!user) throw new NotFoundException('user not found');

    const skill = await this.skillRepository.findOne({
      where: {
        id: skillId,
      },
    });
    if (!skill) throw new NotFoundException('skill not found');

    const alreadyAddedSkill = user.skills.some((s) => s.id === skillId);
    if (!alreadyAddedSkill) {
      user.skills.push(skill);
      await this.userRepository.save(user);
    }

    return {
      message: 'Skill added successfully',
    };
  }

  async removeSkill(userId: string, skillId: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.skills', 'skill')
      .where('user.id = :id', { id: userId })
      .getOne();

    // const user = await this.userRepository.findOne({
    //   where: {
    //     id: userId,
    //   },
    // });
    if (!user) throw new NotFoundException('User not found');

    const skill = await this.skillRepository.findOne({
      where: {
        id: skillId,
      },
    });

    if (!skill) throw new NotFoundException('skill not found');

    user.skills = user.skills.filter((s) => s.id !== skillId);
    await this.userRepository.save(user);

    return {
      message: 'Skill removed successfully',
    };
  }
}
