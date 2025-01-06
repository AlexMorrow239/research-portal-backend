import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';

import { AdditionalInfoDto } from './additional-info.dto';
import { AvailabilityDto } from './student-availability.dto';
import { StudentInfoDto } from './student-info.dto';

export class CreateApplicationDto {
  @ApiProperty()
  @ValidateNested()
  @Type(() => StudentInfoDto)
  @IsNotEmpty()
  studentInfo: StudentInfoDto;

  @ApiProperty()
  @ValidateNested()
  @Type(() => AvailabilityDto)
  @IsNotEmpty()
  availability: AvailabilityDto;

  @ApiProperty()
  @ValidateNested()
  @Type(() => AdditionalInfoDto)
  @IsNotEmpty()
  additionalInfo: AdditionalInfoDto;
}
