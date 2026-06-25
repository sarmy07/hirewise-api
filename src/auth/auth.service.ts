/*
https://docs.nestjs.com/providers#services
*/

import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/regsiter.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import authConfig from './config/auth.config';
import type { ConfigType } from '@nestjs/config';
import { HashingProvider } from './providers/hashing.provider';
import { Role } from 'src/common/enums/role.enum';
import { RefreshTokenDto } from './dto/refresh.token.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(authConfig.KEY)
    private readonly authConfiguration: ConfigType<typeof authConfig>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
    private readonly hashingProvider: HashingProvider,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.userRepository.findOne({
      where: {
        email: dto.email,
      },
    });

    if (existing) throw new ConflictException('email already in use');

    const hashPass = await this.hashingProvider.hash(dto.password);

    const user = this.userRepository.create({
      ...dto,
      password: hashPass,
    });

    const { password, ...rest } = user;
    await this.userRepository.save(user);

    return {
      message: 'User registered!',
      user: rest,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new NotFoundException('Email does not exist');

    const validPass = await this.hashingProvider.compare(
      dto.password,
      user.password,
    );
    if (!validPass) throw new BadRequestException('invalid credentials');

    return await this.generateTokens(user);
  }

  async validategoogleUser(user: any) {
    let existingUser = await this.userRepository.findOne({
      where: {
        email: user.email,
      },
    });
    if (!existingUser) {
      existingUser = await this.userRepository.save({
        name: user.name,
        email: user.email,
        googleId: user.googleId,
        role: Role.SEEKER,
      });
    }

    const tokens = await this.generateTokens(existingUser);

    const { password, refreshToken, ...rest } = existingUser;

    return {
      tokens,
      user: rest,
    };
  }

  async refreshToken(userid: string, dto: RefreshTokenDto) {
    const user = await this.userRepository.findOne({
      where: {
        id: userid,
      },
    });
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('access denied');
    }

    const match = await this.hashingProvider.compare(
      dto.refreshToken,
      user.refreshToken,
    );

    if (!match) throw new UnauthorizedException('access denied');

    return await this.generateTokens(user);
  }

  private async generateTokens(user: any) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.authConfiguration.secret,
        expiresIn: this.authConfiguration.expiresIn as any,
      }),

      this.jwtService.signAsync(payload, {
        secret: this.authConfiguration.refresh_secret,
        expiresIn: this.authConfiguration.refresh_expiresIn as any,
      }),
    ]);

    const hashed = await this.hashingProvider.hash(refreshToken);
    await this.userRepository.update(user.id, { refreshToken: hashed });

    return { accessToken, refreshToken };
  }
}
