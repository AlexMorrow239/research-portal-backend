import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

import { NameDto } from '../base/name.dto';

class ProfessorLoginInfoDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    example: 'professor.test@miami.edu',
    description: 'University of Miami email address',
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ type: NameDto })
  @ValidateNested()
  @Type(() => NameDto)
  name: NameDto;

  @ApiProperty({ example: 'Computer Science' })
  @IsString()
  @IsNotEmpty()
  department: string;

  @ApiProperty({
    example: 'Associate Professor',
    required: false,
  })
  @IsString()
  title?: string;
}

export class LoginResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT token used for authorization',
  })
  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @ApiProperty({ type: ProfessorLoginInfoDto })
  @ValidateNested()
  @Type(() => ProfessorLoginInfoDto)
  professor: ProfessorLoginInfoDto;
}
