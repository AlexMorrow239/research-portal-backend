import { IsString, IsOptional, ValidateNested, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

class UpdateNameDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  lastName?: string;
}

export class UpdateProfessorDto {
  @ApiPropertyOptional()
  @ValidateNested()
  @Type(() => UpdateNameDto)
  @IsOptional()
  name?: UpdateNameDto;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  title?: string;

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
  @IsOptional()
  @MaxLength(1000)
  bio?: string;
}