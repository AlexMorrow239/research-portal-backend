import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import {
  StudentInfoDto,
  ResearchExperienceDto,
  CancerResearchInterestDto,
  AvailabilityDto,
  AdditionalInfoDto,
} from './student-info.dto';

export class CreateApplicationDto {
  @ApiProperty()
  @ValidateNested()
  @Type(() => StudentInfoDto)
  studentInfo: StudentInfoDto;

  @ApiProperty()
  @ValidateNested()
  @Type(() => ResearchExperienceDto)
  researchExperience: ResearchExperienceDto;

  @ApiProperty()
  @ValidateNested()
  @Type(() => CancerResearchInterestDto)
  cancerResearchInterest: CancerResearchInterestDto;

  @ApiProperty()
  @ValidateNested()
  @Type(() => AvailabilityDto)
  availability: AvailabilityDto;

  @ApiProperty()
  @ValidateNested()
  @Type(() => AdditionalInfoDto)
  additionalInfo: AdditionalInfoDto;
}
