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

  @ApiProperty({ example: 50 })
  totalInterviews: number;

  @ApiProperty({ example: 25 })
  totalAcceptedOffers: number;

  @ApiProperty({ example: 10 })
  totalDeclinedOffers: number;

  @ApiProperty({ example: 25.0 })
  interviewRate: number;

  @ApiProperty({ example: 50.0 })
  offerAcceptanceRate: number;
}

export class ComprehensiveAnalyticsDto {
  @ApiProperty()
  emailEngagement: EmailEngagementStats;

  @ApiProperty()
  applicationFunnel: ApplicationFunnelStats;

  @ApiProperty({ example: '2024-03-15' })
  lastUpdated: Date;
}
