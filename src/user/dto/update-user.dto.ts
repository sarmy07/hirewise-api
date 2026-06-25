import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  avatar?: string;

  @ApiPropertyOptional()
  @IsOptional()
  portofolioUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  bio?: string;

  @ApiPropertyOptional()
  @IsOptional()
  location?: string;
}
