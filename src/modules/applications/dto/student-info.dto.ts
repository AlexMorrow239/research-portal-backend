import { NameDto } from '@/modules/professors/dto/create-professor.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsEmail,
  IsNumber,
  IsDate,
  Min,
  Max,
  IsEnum,
  IsBoolean,
  ValidateNested,
  IsNotEmpty,
  IsArray,
  ArrayMinSize,
  IsOptional,
} from 'class-validator';

export enum RacialEthnicGroup {
  AMERICAN_INDIAN = 'American Indian or Indian Alaskan',
  BLACK = 'Black or African American',
  HISPANIC = 'Hispanic/Latino',
  NATIVE_HAWAIIAN = 'Native Hawaiian or Pacific Islander',
  WHITE = 'White',
  OTHER = 'Other',
}

export enum Citizenship {
  US_CITIZEN = 'US Citizen',
  PERMANENT_RESIDENT = 'Permanent Resident',
  FOREIGN_STUDENT = 'Foreign Student',
}

export enum College {
  ARTS_AND_SCIENCES = 'College of Arts and Sciences',
  // Add other colleges here
}

export enum WeeklyAvailability {
  ZERO_TO_FIVE = '0-5',
  SIX_TO_EIGHT = '6-8',
  NINE_TO_ELEVEN = '9-11',
  TWELVE_PLUS = '12+',
}

export enum ProjectLength {
  ONE = 'one',
  TWO = 'two',
  THREE = 'three',
  FOUR_PLUS = '4+',
}

export class StudentInfoDto {
  @ApiProperty()
  @ValidateNested()
  @Type(() => NameDto)
  name: NameDto;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  cNumber: string;

  @ApiProperty({ example: 'student@miami.edu' })
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  phoneNumber: string;

  @ApiProperty()
  @IsString()
  genderIdentity: string;

  @ApiProperty({ enum: RacialEthnicGroup, isArray: true })
  @IsEnum(RacialEthnicGroup, { each: true })
  @IsArray()
  @ArrayMinSize(1)
  racialEthnicGroups: RacialEthnicGroup[];

  @ApiProperty({ enum: Citizenship })
  @IsEnum(Citizenship)
  citizenship: Citizenship;

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

export class ResearchExperienceDto {
  @ApiProperty()
  @IsBoolean()
  hasPreviousExperience: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  experienceDescription?: string;

  @ApiProperty()
  @IsString()
  researchInterestCategory: string;

  @ApiProperty()
  @IsString()
  researchInterestDescription: string;

  @ApiProperty()
  @IsString()
  educationalCareerGoals: string;

  @ApiProperty()
  @IsString()
  courseworkSkills: string;
}

export class CancerResearchInterestDto {
  @ApiProperty()
  @IsBoolean()
  hasOncologyInterest: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  scccInterest?: string;
}

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

  @ApiProperty({ enum: WeeklyAvailability })
  @IsEnum(WeeklyAvailability)
  weeklyHours: WeeklyAvailability;

  @ApiProperty({ enum: ProjectLength })
  @IsEnum(ProjectLength)
  desiredProjectLength: ProjectLength;
}

export class AdditionalInfoDto {
  @ApiProperty()
  @IsBoolean()
  hasFederalWorkStudy: boolean;

  @ApiProperty()
  @IsBoolean()
  speaksOtherLanguages: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  additionalLanguages?: string;

  @ApiProperty()
  @IsBoolean()
  comfortableWithAnimals: boolean;

  @ApiProperty()
  @IsString()
  howHeardAboutProgram: string;
}
