import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { College } from '@common/enums/application.enums';

export class StudentAcademicInfoDto {
  @ApiProperty()
  @IsBoolean()
  hasPostSecondaryTranscript: boolean;

  @ApiProperty()
  @IsString()
  academicStanding: string;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  graduationDate: Date;

  @ApiProperty({ enum: College })
  @IsEnum(College)
  major1College: College;

  @ApiProperty()
  @IsString()
  major1: string;

  @ApiProperty()
  @IsBoolean()
  hasAdditionalMajor: boolean;

  @ApiProperty({ enum: College, required: false })
  @IsEnum(College)
  @IsOptional()
  major2College?: College;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  major2?: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(4.0)
  gpa: number;
}
