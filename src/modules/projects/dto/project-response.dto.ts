import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { ProjectFileDto } from './project-file.dto';
import { ProjectStatus } from '../schemas/projects.schema';

export class ProjectResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  professor: {
    id: string;
    name: {
      firstName: string;
      lastName: string;
    };
    department: string;
  };

  @ApiProperty()
  department: string;

  @ApiProperty()
  requirements: string[];

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;

  @ApiProperty({ enum: ProjectStatus })
  status: ProjectStatus;

  @ApiProperty()
  positions: number;

  @ApiPropertyOptional()
  tags?: string[];

  @ApiProperty()
  applicationDeadline: Date;

  @ApiProperty()
  isVisible: boolean;

  @ApiProperty({ type: [ProjectFileDto] })
  files: ProjectFileDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
