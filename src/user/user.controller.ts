import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt.auth.guard';

@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user profile' })
  getMe(@CurrentUser() user: any) {
    return this.userService.getMe(user.id);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update current user profile' })
  updateMe(@CurrentUser() user: any, @Body() dto: UpdateUserDto) {
    return this.userService.updateMe(user.id, dto);
  }

  @Delete('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete current user account' })
  deleteMe(@CurrentUser() user: any) {
    return this.userService.deleteMe(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get any user public profile' })
  getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Post('me/skills')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Add a skill to seeker profile' })
  addSkill(@CurrentUser() user: any, @Body('skillId') skillId: string) {
    return this.userService.addSkill(user.id, skillId);
  }

  @Delete('me/skills/:skillId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a skill from seeker profile' })
  deleteSkill(@CurrentUser() user: any, @Param('skillId') skillId: string) {
    return this.userService.removeSkill(user.id, skillId);
  }
}
