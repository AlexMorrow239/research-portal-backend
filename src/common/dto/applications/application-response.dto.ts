import { ApiProperty } from '@nestjs/swagger';

import { ApplicationStatus } from '@/common/enums';

import { AdditionalInfoDto } from './additional-info.dto';
import { AvailabilityDto } from './student-availability.dto';
import { StudentInfoDto } from './student-info.dto';
import { ProjectResponseDto } from '../projects/project-response.dto';

export class ApplicationResponseDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  id: string;

  @ApiProperty({ type: () => ProjectResponseDto })
  project: ProjectResponseDto;

  @ApiProperty({ type: () => StudentInfoDto })
  studentInfo: StudentInfoDto;

  @ApiProperty({ type: () => AvailabilityDto })
  availability: AvailabilityDto;

  @ApiProperty({ type: () => AdditionalInfoDto })
  additionalInfo: AdditionalInfoDto;

  @ApiProperty({ example: 'resume-123456.pdf' })
  resumeFile: string;

  @ApiProperty({
    enum: ApplicationStatus,
    example: ApplicationStatus.PENDING,
    description: 'Current status of the application',
  })
  status: ApplicationStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
