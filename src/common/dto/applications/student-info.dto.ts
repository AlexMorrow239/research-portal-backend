import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

import { AcademicStanding, Citizenship, College } from '@common/enums';

import { NameDto } from '../base/name.dto';

export class StudentInfoDto {
  @ApiProperty({ type: NameDto })
  @ValidateNested()
  @Type(() => NameDto)
  name: NameDto;

  @ApiProperty({
    example: 'C12345678',
    description: 'University of Miami C-Number',
    pattern: '^C[0-9]{8}$',
  })
  @IsString()
  @Matches(/^C[0-9]{8}$/, { message: 'C-Number must be in format: C12345678' })
  cNumber: string;

  @ApiProperty({
    example: 'student@miami.edu',
    description: 'University of Miami email address',
  })
  @IsEmail()
  @Matches(/^[a-zA-Z0-9._-]+@miami\.edu$/, {
    message: 'Email must be a valid miami.edu address',
  })
  email: string;

  @ApiProperty({
    example: '305-123-4567',
    pattern: '^[0-9]{3}-[0-9]{3}-[0-9]{4}$',
  })
  @IsString()
  @Matches(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/, {
    message: 'Phone number must be in format: XXX-XXX-XXXX',
  })
  phoneNumber: string;

  @ApiProperty({
    type: [String],
    description: 'Racial/Ethnic groups the student identifies with',
    example: ['Hispanic/Latino', 'White'],
  })
  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  racialEthnicGroups: string[];

  @ApiProperty({
    enum: Citizenship,
    example: Citizenship.US_CITIZEN,
    description: 'Citizenship status',
  })
  @IsEnum(Citizenship)
  citizenship: Citizenship;

  @ApiProperty({
    enum: AcademicStanding,
    example: AcademicStanding.JUNIOR,
    description: 'Current academic standing',
  })
  @IsEnum(AcademicStanding)
  academicStanding: AcademicStanding;

  @ApiProperty({
    example: '2025-05-15',
    description: 'Expected graduation date',
  })
  @Type(() => Date)
  @IsDate()
  graduationDate: Date;

  @ApiProperty({
    enum: College,
    example: College.ARTS_AND_SCIENCES,
    description: 'College of primary major',
  })
  @IsEnum(College)
  major1College: College;

  @ApiProperty({
    example: 'Computer Science',
    description: 'Primary major',
  })
  @IsString()
  @MinLength(2)
  major1: string;

  @ApiProperty()
  @IsBoolean()
  hasAdditionalMajor: boolean;

  @ApiProperty({
    required: false,
    enum: College,
    description: 'College of secondary major',
  })
  @IsEnum(College)
  @IsOptional()
  major2College?: College;

  @ApiProperty({
    required: false,
    example: 'Mathematics',
    description: 'Secondary major',
  })
  @IsString()
  @MinLength(2)
  @IsOptional()
  major2?: string;

  @ApiProperty()
  @IsBoolean()
  isPreHealth: boolean;

  @ApiProperty({
    required: false,
    example: 'Pre-Med',
    description: 'Pre-health track if applicable',
  })
  @IsString()
  @MinLength(2)
  @IsOptional()
  preHealthTrack?: string;

  @ApiProperty({
    minimum: 0,
    maximum: 4.0,
    example: 3.5,
    description: 'Current GPA (0.0 - 4.0)',
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(4.0)
  gpa: number;
}
