import { AuthController } from './auth.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { HashingProvider } from './providers/hashing.provider';
import { BcryptProvider } from './providers/bcrypt.provider';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import authConfig from './config/auth.config';
import { User } from 'src/user/entities/user.entity';
import { JwtAuthGuard } from './guard/jwt.auth.guard';
import { RoleGuard } from './guard/roles.guard';
import { GoogleStrategy } from './strategy/google.strategy';
import googleConfig from './config/google.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule.forFeature(authConfig),
    ConfigModule.forFeature(googleConfig),
    JwtModule.registerAsync(authConfig.asProvider()),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtAuthGuard,
    RoleGuard,
    GoogleStrategy,
    {
      provide: HashingProvider,
      useClass: BcryptProvider,
    },
  ],
  exports: [HashingProvider, AuthService, JwtAuthGuard, RoleGuard, JwtModule],
})
export class AuthModule {}
