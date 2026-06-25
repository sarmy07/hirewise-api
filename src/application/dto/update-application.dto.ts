import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { ApplicationStatus } from 'src/common/enums/application.status.enum';

export class UpdateApplicationDto {
  @ApiProperty()
  @IsEnum(ApplicationStatus)
  status: ApplicationStatus;
}
