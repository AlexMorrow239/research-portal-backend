import { ApiProperty } from '@nestjs/swagger';

class EmailEngagementStats {
  @ApiProperty({ example: 100 })
  totalEmails: number;

  @ApiProperty({ example: 75 })
  totalViews: number;

  @ApiProperty({ example: 85 })
  totalClicks: number;

  @ApiProperty({ example: 75.0 })
  viewRate: number;

  @ApiProperty({ example: 0.85 })
  averageClicksPerEmail: number;
}

class ApplicationFunnelStats {
  @ApiProperty({ example: 100 })
  totalApplications: number;

  @ApiProperty({ example: 75 })
  pendingApplications: number;

  @ApiProperty({ example: 25 })
  closedApplications: number;

  @ApiProperty({ example: 25.0 })
  closeRate: number;
}

export class AnalyticsDto {
  @ApiProperty()
  emailEngagement: EmailEngagementStats;

  @ApiProperty()
  applicationFunnel: ApplicationFunnelStats;

  @ApiProperty({ example: '2024-03-15' })
  lastUpdated: Date;
}
