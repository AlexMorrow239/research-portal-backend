import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

import { NameDto } from '../base/name.dto';

class ProfessorLoginInfoDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'Unique identifier for the professor',
    format: 'mongodb-objectid',
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    example: 'professor.name@miami.edu',
    description: 'University of Miami email address',
    format: 'email',
    pattern: '.*@miami.edu$',
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: NameDto,
    description: "Professor's full name information",
    example: {
      firstName: 'John',
      lastName: 'Doe',
    },
  })
  @ValidateNested()
  @Type(() => NameDto)
  name: NameDto;

  @ApiProperty({
    example: 'Computer Science',
    description: 'Academic department',
  })
  @IsString()
  @IsNotEmpty()
  department: string;

  @ApiProperty({
    example: 'Associate Professor',
    description: 'Academic title',
    required: false,
  })
  @IsString()
  title?: string;
}

export class LoginResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: `JWT access token for authorization.
      Include this token in the Authorization header as 'Bearer <token>'
      for subsequent authenticated requests.`,
    format: 'jwt',
  })
  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @ApiProperty({
    type: ProfessorLoginInfoDto,
    description: 'Basic professor information returned upon successful authentication',
  })
  @ValidateNested()
  @Type(() => ProfessorLoginInfoDto)
  professor: ProfessorLoginInfoDto;
}
