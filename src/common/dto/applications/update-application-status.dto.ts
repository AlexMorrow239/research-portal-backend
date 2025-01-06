import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

import { ApplicationStatus } from '@/common/enums';

export class UpdateApplicationStatusDto {
  @ApiProperty({ enum: ApplicationStatus })
  @IsEnum(ApplicationStatus)
  status: ApplicationStatus;
}
