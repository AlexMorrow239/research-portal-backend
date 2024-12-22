import { IsString, IsEmail, IsNotEmpty, ValidateNested, MinLength, IsOptional, MaxLength, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class NameDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName: string;
}

export class CreateProfessorDto {
  @ApiProperty({ example: 'jdoe', minLength: 3 })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  username: string;

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

  @ApiProperty({ example: 'john.doe@miami.edu', pattern: '^[a-zA-Z0-9._-]+@miami\\.edu$' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Computer Science' })
  @IsString()
  @IsNotEmpty()
  department: string;

  @ApiPropertyOptional({ example: 'Associate Professor' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ example: ['AI', 'Machine Learning'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  researchAreas?: string[];

  @ApiPropertyOptional({ example: 'McArthur Engineering Building, Room 123' })
  @IsString()
  @IsOptional()
  office?: string;

  @ApiPropertyOptional({ example: '+1 (305) 123-4567' })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiPropertyOptional({ example: 'Specializing in artificial intelligence and machine learning...' })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  bio?: string;
}