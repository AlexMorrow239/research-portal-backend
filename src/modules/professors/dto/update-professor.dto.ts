import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsOptional, ValidateNested, MaxLength, IsArray } from 'class-validator';

import { NameDto } from './create-professor.dto';

export class UpdateProfessorDto {
  @ApiPropertyOptional()
  @ValidateNested()
  @Type(() => NameDto)
  @IsOptional()
  name?: NameDto;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  researchAreas?: string[];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  office?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiPropertyOptional()
  @IsString()
  @MaxLength(1000)
  @IsOptional()
  bio?: string;
}
