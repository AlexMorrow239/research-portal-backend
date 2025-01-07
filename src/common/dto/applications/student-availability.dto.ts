import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

import { WeeklyAvailability, ProjectLength } from '@common/enums/application.enums';

export class AvailabilityDto {
  @ApiProperty()
  @IsString()
  mondayAvailability: string;

  @ApiProperty()
  @IsString()
  tuesdayAvailability: string;

  @ApiProperty()
  @IsString()
  wednesdayAvailability: string;

  @ApiProperty()
  @IsString()
  thursdayAvailability: string;

  @ApiProperty()
  @IsString()
  fridayAvailability: string;
  @ApiProperty({
    enum: WeeklyAvailability,
    description: 'Number of hours available per week',
    example: WeeklyAvailability.NINE_TO_ELEVEN,
  })
  @IsEnum(WeeklyAvailability)
  weeklyHours: string;

  @ApiProperty({
    enum: ProjectLength,
    description: 'Desired length of the project',
    example: ProjectLength.FOUR_PLUS,
  })
  @IsEnum(ProjectLength)
  desiredProjectLength: ProjectLength;
}
