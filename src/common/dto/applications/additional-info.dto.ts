import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class AdditionalInfoDto {
  @ApiProperty()
  @IsBoolean()
  hasPrevResearchExperience: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  prevResearchExperience?: string;

  @ApiProperty()
  @IsString()
  researchInterestDescription: string;

  @ApiProperty()
  @IsBoolean()
  hasFederalWorkStudy: boolean;

  @ApiProperty()
  @IsBoolean()
  speaksOtherLanguages: boolean;

  @ApiProperty({ required: false, type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  additionalLanguages?: string[];

  @ApiProperty()
  @IsBoolean()
  comfortableWithAnimals: boolean;
}
