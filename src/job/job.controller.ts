import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt.auth.guard';
import { RoleGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { FilterJobDto } from './dto/filter-job.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  @Roles(Role.EMPLOYER)
  @ApiOperation({ summary: 'Create a job - employer only' })
  create(@CurrentUser() user: any, @Body() createJobDto: CreateJobDto) {
    return this.jobService.create(user.id, createJobDto);
  }

  @Get()
  @ApiOperation({ summary: 'Search and filter all open jobs' })
  findAll(@Query() filter: FilterJobDto) {
    return this.jobService.findAll(filter);
  }

  @Get('my-jobs')
  @Roles(Role.EMPLOYER)
  @ApiOperation({ summary: 'Get all jobs posted by current employer' })
  getMyJobs(@CurrentUser() user: any) {
    return this.jobService.getMyJobs(user.id);
  }

  @Patch(':jobId/toggle')
  @Roles(Role.EMPLOYER)
  @ApiOperation({ summary: 'Open or close a job - employer only' })
  toggleOpen(@Param('jobId') jobId: string, @CurrentUser() user: any) {
    return this.jobService.toggleOpen(jobId, user.id);
  }

  @Get(':jobId')
  @ApiOperation({
    summary: 'Get a single job with skills and applications count',
  })
  findOne(@Param('jobId') jobId: string) {
    return this.jobService.findOne(jobId);
  }

  @Patch(':jobId')
  @Roles(Role.EMPLOYER)
  @ApiOperation({ summary: 'Update a job - employer only' })
  update(
    @Param('jobId') jobId: string,
    @CurrentUser() user: any,
    @Body() updateJobDto: UpdateJobDto,
  ) {
    return this.jobService.update(jobId, user.id, updateJobDto);
  }

  @Delete(':jobId')
  @Roles(Role.EMPLOYER)
  @ApiOperation({ summary: 'Delete a job - employer only' })
  remove(@Param('jobId') jobId: string, @CurrentUser() user: any) {
    return this.jobService.remove(jobId, user.id);
  }
}
