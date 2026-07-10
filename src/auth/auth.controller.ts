/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/regsiter.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guard/jwt.auth.guard';
import { GoogleAuthGuard } from './guard/google.auth.guard';
import { Throttle } from '@nestjs/throttler';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Throttle({ global: { ttl: 6000, limit: 5 } })
  @ApiOperation({ summary: 'register user' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @Throttle({ global: { ttl: 6000, limit: 2 } })
  @ApiOperation({ summary: 'login user' })
  login(@Body() dto: LoginDto) {
    console.log('login-hit');
    return this.authService.login(dto);
  }

  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Google login' })
  googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Google callback' })
  googleCallback(@Req() req) {
    return this.authService.validategoogleUser(req.user);
  }

  //   @Get('me')
  //   @UseGuards(JwtAuthGuard)
  //   @ApiOperation({ summary: 'get current user' })
  //   getMe(@Req() req) {
  //     return req.user;
  //   }
}
