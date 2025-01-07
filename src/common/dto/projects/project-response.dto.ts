import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { ProjectFileDto } from './project-file.dto';
import { ProjectStatus } from '../../../modules/projects/schemas/projects.schema';
import { NameDto } from '../base/name.dto';

export class ProjectResponseDto {
  @ApiProperty({
    description: 'Unique project identifier',
    example: '507f1f77bcf86cd799439011',
  })
  id: string;

  @ApiProperty({
    description: 'Project title',
    example: 'Machine Learning Research Assistant',
  })
  title: string;

  @ApiProperty({
    description: 'Detailed project description',
    example: 'Looking for students interested in ML and computer vision research...',
  })
  description: string;

  @ApiProperty({
    description: 'Professor information',
    example: {
      id: '507f1f77bcf86cd799439012',
      name: { firstName: 'John', lastName: 'Doe' },
      department: 'Computer Science',
      email: 'john.doe@miami.edu',
    },
  })
  professor: {
    id: string;
    name: NameDto;
    department: string;
    email: string;
  };

  @ApiProperty({
    description: 'Research categories',
    example: ['Machine Learning', 'Computer Vision'],
    type: [String],
  })
  researchCategories: string[];

  @ApiProperty({
    description: 'Project requirements',
    example: ['Strong programming skills', 'Background in ML'],
    type: [String],
  })
  requirements: string[];

  @ApiProperty({
    description: 'Current project status',
    enum: ProjectStatus,
    example: 'PUBLISHED',
  })
  status: ProjectStatus;

  @ApiProperty({
    description: 'Number of available positions',
    example: 2,
    minimum: 1,
  })
  positions: number;

  @ApiPropertyOptional({
    description: 'Application deadline',
    example: '2024-12-31T23:59:59.999Z',
  })
  applicationDeadline?: Date;

  @ApiProperty({
    description: 'Project visibility status',
    example: true,
  })
  isVisible: boolean;

  @ApiProperty({
    description: 'Attached project files',
    type: [ProjectFileDto],
  })
  files: ProjectFileDto[];

  @ApiProperty({
    description: 'Project creation timestamp',
    example: '2024-03-15T12:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-03-15T12:00:00Z',
  })
  updatedAt: Date;
}
