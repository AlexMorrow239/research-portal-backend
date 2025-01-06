import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsOptional, ValidateNested, MaxLength, IsArray } from 'class-validator';

import { PublicationDto } from './create-professor.dto';
import { NameDto } from '../base/name.dto';

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
  researchAreas: string[];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  office?: string;

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

  @ApiPropertyOptional()
  @IsString()
  @MaxLength(1000)
  @IsOptional()
  bio?: string;
}
