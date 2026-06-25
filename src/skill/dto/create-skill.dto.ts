import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSkillDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}
