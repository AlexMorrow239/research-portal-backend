import { ApiProperty } from '@nestjs/swagger';

export class ProjectFileDto {
  @ApiProperty({
    description: 'Generated unique filename in storage',
    example: '1234567890-project-description.pdf',
  })
  fileName: string;

  @ApiProperty({
    description: 'Original filename uploaded by user',
    example: 'project-description.pdf',
  })
  originalName: string;

  @ApiProperty({
    description: 'File MIME type',
    example: 'application/pdf',
  })
  mimeType: string;

  @ApiProperty({
    description: 'File size in bytes',
    example: 1048576,
  })
  size: number;

  @ApiProperty({
    description: 'File upload timestamp',
    example: '2024-03-15T12:00:00Z',
  })
  uploadedAt: Date;
}
