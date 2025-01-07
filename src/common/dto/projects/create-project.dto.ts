import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsDate, IsNumber, IsArray, Min, IsEnum } from 'class-validator';

import { ProjectStatus } from '../../../modules/projects/schemas/projects.schema';
import { IsFutureDate } from '../../validators/date.validator';

const getDefaultDeadlineExample = () => {
  const date = new Date();
  date.setMonth(date.getMonth() + 3); // Set to 3 months in the future
  return date.toISOString();
};
export class CreateProjectDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  researchCategories: string[];

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  requirements: string[];

  @ApiProperty({ enum: ProjectStatus, default: ProjectStatus.DRAFT })
  @IsEnum(ProjectStatus)
  status: ProjectStatus;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  positions: number;

  @ApiProperty({
    description: 'Application deadline (must be a future date)',
    example: getDefaultDeadlineExample(),
  })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  @IsFutureDate({ message: 'Application deadline must be in the future' })
  applicationDeadline: Date;
}
