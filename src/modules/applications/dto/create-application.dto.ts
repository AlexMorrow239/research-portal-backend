import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsEmail,
  IsNumber,
  IsDate,
  Min,
  Max,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';

class NameDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;
}

export class StudentInfoDto {
  @ApiProperty({
    example: {
      firstName: 'John',
      lastName: 'Doe',
    },
  })
  @ValidateNested()
  @Type(() => NameDto)
  name: NameDto;

  @ApiProperty({ example: 'student@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Computer Science' })
  @IsString()
  major: string;

  @ApiProperty({ example: 3.5 })
  @IsNumber()
  @Min(0)
  @Max(4.0)
  gpa: number;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  expectedGraduation: Date;
}

export class CreateApplicationDto {
  @ApiProperty()
  @ValidateNested()
  @Type(() => StudentInfoDto)
  studentInfo: StudentInfoDto;

  @ApiProperty({ example: 'I am interested in this research project because...' })
  @IsString()
  statement: string;
}
