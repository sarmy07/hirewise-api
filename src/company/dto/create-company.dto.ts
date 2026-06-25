import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  industry?: string;

  @ApiProperty()
  @IsUrl()
  @IsOptional()
  website?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  logo?: string;
}
