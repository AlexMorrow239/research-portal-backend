import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  ValidateNested,
  MinLength,
  IsOptional,
  MaxLength,
  IsArray,
  IsUrl,
  ArrayMinSize,
} from 'class-validator';

import { NameDto } from '../base/name.dto';

export class PublicationDto {
  @ApiProperty({ example: 'Machine Learning in Healthcare' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'https://doi.org/10.1234/example' })
  @IsString()
  @IsUrl()
  @IsNotEmpty()
  link: string;
}

export class CreateProfessorDto {
  @ApiProperty({
    example: 'john.doe@miami.edu',
    description: 'University of Miami email address (will be used as username)',
    pattern: '^[a-zA-Z0-9._-]+@miami\\.edu$',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Password123!', minLength: 8 })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  adminPassword: string;

  @ApiProperty({ type: NameDto })
  @ValidateNested()
  @Type(() => NameDto)
  name: NameDto;

  @ApiProperty({ example: 'Computer Science' })
  @IsString()
  @IsNotEmpty()
  department: string;

  @ApiPropertyOptional({ example: 'Associate Professor' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    type: [String],
    description: 'Research areas of expertise',
    example: ['Machine Learning', 'Artificial Intelligence'],
    minItems: 1,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @ArrayMinSize(1, {
    message: 'At least one research area must be specified, or do not include this field.',
  })
  researchAreas: string[];

  @ApiPropertyOptional({ example: 'McArthur Engineering Building, Room 123' })
  @IsString()
  @IsNotEmpty()
  office: string;

  @ApiPropertyOptional({
    type: [PublicationDto],
    example: [
      {
        title: 'Machine Learning in Healthcare',
        link: 'https://doi.org/10.1234/example',
      },
    ],
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PublicationDto)
  publications?: PublicationDto[];

  @ApiPropertyOptional({
    example: 'Specializing in artificial intelligence and machine learning...',
    maxLength: 1000,
  })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  bio?: string;
}
