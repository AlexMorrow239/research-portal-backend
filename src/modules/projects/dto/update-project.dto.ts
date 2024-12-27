import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsDate, IsNumber, IsArray, IsOptional, Min, IsEnum } from 'class-validator';

import { ProjectStatus } from '../schemas/projects.schema';

export class UpdateProjectDto {
  @ApiPropertyOptional({ example: 'AI Research Assistant' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    example: 'Research project focusing on developing AI-powered research tools',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: ['Python programming', 'Machine Learning basics'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  requirements?: string[];

  @ApiPropertyOptional()
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  startDate?: Date;

  @ApiPropertyOptional()
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  endDate?: Date;

  @ApiPropertyOptional({ enum: ProjectStatus })
  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;

  @ApiPropertyOptional({ example: 2, description: 'Number of positions available' })
  @IsNumber()
  @Min(1)
  @IsOptional()
  positions?: number;

  @ApiPropertyOptional({ example: ['AI', 'Machine Learning'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional()
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  applicationDeadline?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  isVisible?: boolean;
}
