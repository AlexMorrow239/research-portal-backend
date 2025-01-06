import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { StudentInfoDto } from './student-info.dto';
import { AdditionalInfoDto } from './additional-info.dto';
import { AvailabilityDto } from './student-availability.dto';

export class CreateApplicationDto {
  @ApiProperty()
  @ValidateNested()
  @Type(() => StudentInfoDto)
  studentInfo: StudentInfoDto;

  @ApiProperty()
  @ValidateNested()
  @Type(() => AvailabilityDto)
  availability: AvailabilityDto;

  @ApiProperty()
  @ValidateNested()
  @Type(() => AdditionalInfoDto)
  additionalInfo: AdditionalInfoDto;
}
