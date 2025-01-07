import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import {
  ApiGetProjectAnalytics,
  ApiGetGlobalAnalytics,
} from '@/common/swagger/decorators/analytics.decorator';

import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

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
