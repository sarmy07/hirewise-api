/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/regsiter.dto';
import { ApiOperation } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guard/jwt.auth.guard';
import { GoogleAuthGuard } from './guard/google.auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'register user' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'login user' })
  login(@Body() dto: LoginDto) {
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
