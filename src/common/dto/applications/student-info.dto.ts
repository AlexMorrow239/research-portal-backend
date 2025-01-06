import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { NameDto } from '../base/name.dto';

export class StudentInfoDto {
  @ApiProperty()
  @ValidateNested()
  @Type(() => NameDto)
  name: NameDto;

  @ApiProperty()
  @IsString()
  cNumber: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  phoneNumber: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  racialEthnicGroups: string[];

  @ApiProperty()
  @IsString()
  citizenship: string;

  @ApiProperty()
  @IsString()
  academicStanding: string;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  graduationDate: Date;

  @ApiProperty()
  @IsString()
  major1College: string;

  @ApiProperty()
  @IsString()
  major1: string;

  @ApiProperty()
  @IsBoolean()
  hasAdditionalMajor: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  major2College?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  major2?: string;

  @ApiProperty()
  @IsBoolean()
  isPreHealth: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  preHealthTrack?: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(4.0)
  gpa: number;
}
