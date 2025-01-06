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
    name: string;
    department: string;
    email: string;
  };

  @ApiProperty({ type: [String] })
  researchCategories: string[];

  @ApiProperty({ type: [String] })
  requirements: string[];

  @ApiProperty({ enum: ProjectStatus })
  status: ProjectStatus;

  @ApiProperty()
  positions: number;

  @ApiPropertyOptional()
  applicationDeadline?: Date;

  @ApiProperty()
  isVisible: boolean;

  @ApiProperty({ type: [ProjectFileDto] })
  files: ProjectFileDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
