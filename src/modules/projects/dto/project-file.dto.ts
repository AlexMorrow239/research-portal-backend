import { ApiProperty } from '@nestjs/swagger';

export class ProjectFileDto {
  @ApiProperty()
  fileName: string;

  @ApiProperty()
  originalName: string;

  @ApiProperty()
  mimeType: string;

  @ApiProperty()
  size: number;

  @ApiProperty()
  uploadedAt: Date;
}