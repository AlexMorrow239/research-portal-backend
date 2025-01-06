import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, IsOptional } from 'class-validator';

export class AdditionalInfoDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  previousResearchExperience: string;

  @ApiProperty()
  @IsBoolean()
  hasFederalWorkStudy: boolean;

  @ApiProperty()
  @IsBoolean()
  speaksOtherLanguages: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  additionalLanguages?: string;

  @ApiProperty()
  @IsBoolean()
  comfortableWithAnimals: boolean;

  @ApiProperty()
  @IsString()
  howHeardAboutProgram: string;
}
