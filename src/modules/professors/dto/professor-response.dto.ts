import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class NameResponseDto {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;
}

export class ProfessorResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: NameResponseDto;

  @ApiProperty()
  department: string;

  @ApiPropertyOptional()
  title?: string;

  @ApiPropertyOptional({ type: [String] })
  researchAreas?: string[];

  @ApiPropertyOptional()
  office?: string;

  @ApiPropertyOptional()
  phoneNumber?: string;

  @ApiPropertyOptional()
  bio?: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
