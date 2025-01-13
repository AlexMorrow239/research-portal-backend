import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiGetGlobalAnalytics, ApiGetProjectAnalytics } from '@/common/docs';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { AnalyticsService } from './analytics.service';

@ApiTags('Analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('projects/:projectId')
  @ApiGetProjectAnalytics()
  async getProjectAnalytics(@Param('projectId') projectId: string) {
    return await this.analyticsService.getProjectAnalytics(projectId);
  }

  @Get('global')
  @ApiGetGlobalAnalytics()
  async getGlobalAnalytics() {
    return await this.analyticsService.getGlobalAnalytics();
  }
}
