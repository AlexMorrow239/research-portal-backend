import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches } from 'class-validator';

export class ReactivateAccountDto {
  @ApiProperty()
  @IsEmail()
  @Matches(/^[a-zA-Z0-9._-]+@miami\.edu$/)
  email: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  adminPassword: string;
}
