import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsEmail, IsNotEmpty, ValidateNested } from 'class-validator';
import { NameDto } from '../base/name.dto';

export class StudentBasicInfoDto {
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
}
