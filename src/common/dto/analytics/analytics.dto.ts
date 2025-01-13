import { ApiProperty } from '@nestjs/swagger';
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
  applicationFunnel: ApplicationFunnelStats;

  @ApiProperty({ example: '2024-03-15' })
  lastUpdated: Date;
}
