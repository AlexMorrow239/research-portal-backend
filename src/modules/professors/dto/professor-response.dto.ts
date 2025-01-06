import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
class PublicationResponseDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  link: string;
}
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

  @ApiProperty()
  office: string;

  @ApiPropertyOptional({ type: [PublicationResponseDto] })
  publications?: PublicationResponseDto[];

  @ApiPropertyOptional({ maxLength: 100 })
  bio?: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
