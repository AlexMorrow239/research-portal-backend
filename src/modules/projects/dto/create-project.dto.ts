import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDate, IsNumber, IsArray, IsOptional, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ProjectStatus } from '../schemas/projects.schema';

export class CreateProjectDto {
  @ApiProperty({ example: 'AI Research Assistant' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Research project focusing on developing AI-powered research tools' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'Computer Science' })
  @IsString()
  @IsNotEmpty()
  department: string;

  @ApiProperty({ example: ['Python programming', 'Machine Learning basics'] })
  @IsArray()
  @IsString({ each: true })
  requirements: string[];

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @ApiProperty({ enum: ProjectStatus, default: ProjectStatus.DRAFT })
  @IsEnum(ProjectStatus)
  status: ProjectStatus;

  @ApiProperty({ example: 2, description: 'Number of positions available' })
  @IsNumber()
  @Min(1)
  positions: number;

  @ApiPropertyOptional({ example: ['AI', 'Machine Learning'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  applicationDeadline: Date;
}