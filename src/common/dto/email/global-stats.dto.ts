import { ApiProperty } from '@nestjs/swagger';

class ProjectStatsDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  projectId: string;

  @ApiProperty({ example: 'Research Project' })
  title: string;

  @ApiProperty({ example: 10 })
  emailsSent: number;

  @ApiProperty({ example: 8 })
  totalClicks: number;

  @ApiProperty({ example: 5 })
  uniqueViews: number;
}

export class GlobalStatsDto {
  @ApiProperty({ example: 100 })
  totalEmails: number;

  @ApiProperty({ example: 75 })
  totalClicks: number;

  @ApiProperty({ example: 0.75 })
  averageClicksPerEmail: number;

  @ApiProperty({ example: 50 })
  totalViewed: number;

  @ApiProperty({ example: 50 })
  viewRate: number;

  @ApiProperty({ type: [ProjectStatsDto] })
  projectStats: ProjectStatsDto[];
}
