import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { ExperienceLevel } from 'src/common/enums/experience-level.enum';
import { JobType } from 'src/common/enums/job-type.enum';

export class CreateJobDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty()
  @IsEnum(JobType)
  type: JobType;

  @ApiProperty()
  @IsEnum(ExperienceLevel)
  experienceLevel: ExperienceLevel;

  @ApiProperty()
  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  salaryMin?: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  salaryMax?: number;

  @ApiProperty()
  @IsArray()
  @IsUUID('all', { each: true })
  @IsOptional()
  skillsIds?: String[];
}
