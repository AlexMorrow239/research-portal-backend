import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsOptional, IsString, MinLength, ArrayMinSize } from 'class-validator';

export class AdditionalInfoDto {
  @ApiProperty({
    description: 'Whether the student has previous research experience',
    example: true,
  })
  @IsBoolean()
  hasPrevResearchExperience: boolean;

  @ApiProperty({
    required: false,
    description: 'Description of previous research experience',
    example: "Worked in Dr. Smith's lab on machine learning research for 2 semesters",
    minLength: 10,
  })
  @IsString()
  @MinLength(10, {
    message: 'Previous research experience description must be at least 10 characters',
  })
  @IsOptional()
  prevResearchExperience?: string;

  @ApiProperty({
    description: 'Description of research interests',
    example: 'Interested in artificial intelligence and its applications in healthcare',
    minLength: 20,
  })
  @IsString()
  @MinLength(20, {
    message: 'Research interest description must be at least 20 characters',
  })
  researchInterestDescription: string;

  @ApiProperty({
    description: 'Whether the student has federal work study',
    example: false,
  })
  @IsBoolean()
  hasFederalWorkStudy: boolean;

  @ApiProperty({
    description: 'Whether the student speaks languages other than English',
    example: true,
  })
  @IsBoolean()
  speaksOtherLanguages: boolean;

  @ApiProperty({
    required: false,
    type: [String],
    description: 'List of additional languages spoken',
    example: ['Spanish', 'French'],
  })
  @IsArray()
  @IsString({ each: true })
  @MinLength(2, { each: true })
  @ArrayMinSize(1, {
    message: 'At least one language must be specified if speaksOtherLanguages is true',
  })
  @IsOptional()
  additionalLanguages?: string[];

  @ApiProperty({
    description: 'Whether the student is comfortable working with animals',
    example: true,
  })
  @IsBoolean()
  comfortableWithAnimals: boolean;
}
