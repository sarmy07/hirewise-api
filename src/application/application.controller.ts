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
import { ApplicationService } from './application.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt.auth.guard';
import { RoleGuard } from 'src/auth/guard/roles.guard';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post()
  @Roles(Role.SEEKER)
  @ApiOperation({ summary: 'Apply to a job - seeker only' })
  apply(
    @CurrentUser() user: any,
    @Body() createApplicationDto: CreateApplicationDto,
  ) {
    return this.applicationService.apply(user.id, createApplicationDto);
  }

  @Get('mine')
  @Roles(Role.SEEKER)
  @ApiOperation({ summary: 'Get all my applications — seeker only' })
  getMyApplications(@CurrentUser() user: any) {
    return this.applicationService.getMyApplications(user.id);
  }

  @Get('mine/:id')
  @Roles(Role.SEEKER)
  @ApiOperation({ summary: 'Get a single application — seeker only' })
  getMyApplication(@CurrentUser() user: any, @Param('id') id: string) {
    return this.applicationService.getMyApplication(user.id, id);
  }

  @Delete('mine/:id/withdraw')
  @Roles(Role.SEEKER)
  @ApiOperation({ summary: 'Withdraw a pending application — seeker only' })
  withdraw(@CurrentUser() user: any, @Param('id') id: string) {
    return this.applicationService.withdraw(id, user.id);
  }

  @Get('employer/stats')
  @Roles(Role.EMPLOYER)
  @ApiOperation({ summary: 'Get dashboard stats — employer only' })
  getStats(@CurrentUser() user: any) {
    return this.applicationService.getStats(user.id);
  }

  @Get('employer/jobs/:jobId')
  @Roles(Role.EMPLOYER)
  @ApiOperation({
    summary: 'Get all applications for a specific job — employer only',
  })
  getJobApplications(@Param('jobId') jobId: string, @CurrentUser() user: any) {
    return this.applicationService.getJobApplication(jobId, user.id);
  }

  @Patch('employer/:id/status')
  @Roles(Role.EMPLOYER)
  @ApiOperation({ summary: 'Update application status — employer only' })
  updateStatus(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() dto: UpdateApplicationDto,
  ) {
    return this.applicationService.updateApplicationStatus(id, user.id, dto);
  }
}
