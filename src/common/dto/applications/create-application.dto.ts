import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { StudentInfoDto } from './student-info.dto';
import { AvailabilityDto } from './student-availability.dto';
import { AdditionalInfoDto } from './additional-info.dto';

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
