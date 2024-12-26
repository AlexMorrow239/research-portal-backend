import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDate, IsNumber, IsArray, IsOptional, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ProjectStatus } from '../schemas/projects.schema';
import { IsAfterDate, IsFutureDate } from '../../../common/validators/date.validator';

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

  @ApiPropertyOptional({
    example: '2024-06-01',
    description: 'Project start date (YYYY-MM-DD)',
    type: String
  })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  @IsFutureDate({ message: 'Start date must be in the future' })
  startDate?: Date;
  
  @ApiPropertyOptional({
    example: '2024-12-31',
    description: 'Project end date (YYYY-MM-DD)',
    type: String
  })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  @IsAfterDate('startDate', { message: 'End date must be after start date' })
  endDate?: Date;

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

  @ApiPropertyOptional({
    example: '2024-05-15',
    description: 'Application deadline (YYYY-MM-DD)',
    type: String
  })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  @IsFutureDate({ message: 'Application deadline must be in the future' })
  applicationDeadline?: Date;
}