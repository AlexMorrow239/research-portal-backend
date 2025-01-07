import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested, IsNotEmpty } from 'class-validator';

import { AdditionalInfoDto } from '@/common/dto/applications/additional-info.dto';
import { AvailabilityDto } from '@/common/dto/applications/student-availability.dto';
import { StudentInfoDto } from '@/common/dto/applications/student-info.dto';
import { ProjectLength, WeeklyAvailability } from '@/common/enums';

@ApiExtraModels(StudentInfoDto, AvailabilityDto, AdditionalInfoDto)
export class CreateApplicationDto {
  @ApiProperty({
    type: () => StudentInfoDto,
    description: 'Student information',
    required: true,
    example: {
      name: { firstName: 'John', lastName: 'Doe' },
      cNumber: 'C12345678',
      email: 'john.doe@miami.edu',
      phoneNumber: '305-123-4567',
      racialEthnicGroups: ['Hispanic/Latino'],
      citizenship: 'US_CITIZEN',
      academicStanding: 'JUNIOR',
      graduationDate: '2025-05-15',
      major1College: 'ARTS_AND_SCIENCES',
      major1: 'Computer Science',
      hasAdditionalMajor: false,
      isPreHealth: false,
      gpa: 3.5,
    },
  })
  @ValidateNested({ message: 'Student information is invalid' })
  @Type(() => StudentInfoDto)
  @IsNotEmpty({ message: 'Student information is required' })
  studentInfo: StudentInfoDto;

  @ApiProperty({
    type: () => AvailabilityDto,
    description: 'Student availability information',
    required: true,
    example: {
      mondayAvailability: '9AM-5PM',
      tuesdayAvailability: '9AM-5PM',
      wednesdayAvailability: '9AM-5PM',
      thursdayAvailability: '9AM-5PM',
      fridayAvailability: '9AM-5PM',
      weeklyHours: WeeklyAvailability.NINE_TO_ELEVEN,
      desiredProjectLength: ProjectLength.THREE,
    },
  })
  @ValidateNested({ message: 'Availability information is invalid' })
  @Type(() => AvailabilityDto)
  @IsNotEmpty({ message: 'Availability information is required' })
  availability: AvailabilityDto;

  @ApiProperty({
    type: () => AdditionalInfoDto,
    description: 'Additional student information',
    required: true,
    example: {
      hasPrevResearchExperience: true,
      prevResearchExperience:
        "Worked in Dr. Smith's lab on machine learning research for 2 semesters",
      researchInterestDescription:
        'Interested in artificial intelligence and its applications in healthcare',
      hasFederalWorkStudy: false,
      speaksOtherLanguages: true,
      additionalLanguages: ['Spanish', 'French'],
      comfortableWithAnimals: true,
    },
  })
  @ValidateNested({ message: 'Additional information is invalid' })
  @Type(() => AdditionalInfoDto)
  @IsNotEmpty({ message: 'Additional information is required' })
  additionalInfo: AdditionalInfoDto;
}
