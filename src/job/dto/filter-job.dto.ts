import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  isString,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { ExperienceLevel } from 'src/common/enums/experience-level.enum';
import { JobType } from 'src/common/enums/job-type.enum';

export class FilterJobDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsEnum(JobType)
  @IsOptional()
  type?: JobType;

  @IsEnum(ExperienceLevel)
  @IsOptional()
  experienceLevel: ExperienceLevel;

  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  salaryMin?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  salaryMax?: number;

  @IsString()
  @IsOptional()
  skills?: string;

  @IsUUID()
  @IsOptional()
  companyId?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;
}
