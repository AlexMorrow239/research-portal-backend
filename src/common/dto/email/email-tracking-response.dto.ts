import { ApiProperty } from '@nestjs/swagger';

export class EmailTrackingResponseDto {
  @ApiProperty({
    description: 'Unique tracking token',
    example: 'abc123-def456',
  })
  token: string;

  @ApiProperty({
    description: 'Number of times email has been clicked',
    example: 0,
  })
  clicks: number;

  @ApiProperty({
    description: 'Whether the email has been viewed',
    example: false,
  })
  hasBeenViewed: boolean;

  @ApiProperty({
    description: 'Timestamps of each click',
    type: [Date],
    example: ['2024-03-15T12:00:00Z'],
  })
  clickTimestamps: Date[];

  @ApiProperty({
    description: 'First click timestamp',
    example: '2024-03-15T12:00:00Z',
    nullable: true,
  })
  firstClickedAt: Date | null;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-03-15T12:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-03-15T12:00:00Z',
  })
  updatedAt: Date;
}
