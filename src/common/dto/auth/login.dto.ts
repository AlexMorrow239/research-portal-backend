import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, Matches } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'professor.name@miami.edu',
    description: 'University of Miami email address',
    format: 'email',
    pattern: '.*@miami.edu$',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  @Matches(/.*@miami\.edu$/, {
    message: 'Email must be a valid miami.edu address',
  })
  email: string;

  @ApiProperty({
    example: 'SecurePass123!',
    description: 'Account password',
    required: true,
    minLength: 8,
    format: 'password',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
