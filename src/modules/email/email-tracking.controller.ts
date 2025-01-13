import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Response } from 'express';

import { ApiGetEmailStats, ApiTrackEmailClick } from '@/common/docs';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { EmailTrackingService } from './email-tracking.service';

@ApiTags('Email Tracking')
@Controller('api/track')
export class EmailTrackingController {
  constructor(private readonly emailTrackingService: EmailTrackingService) {}

  @Get(':token')
  @ApiTrackEmailClick()
  async trackAndRedirect(@Param('token') token: string, @Res() res: Response) {
    await this.emailTrackingService.trackClick(token);
    res.send(`
      <html>
        <body>
          <h1>Research Engine</h1>
          <p>The frontend is under construction. Please check back later.</p>
        </body>
      </html>
    `);
  }

  @Get('stats/global')
  @UseGuards(JwtAuthGuard)
  @ApiGetEmailStats()
  async getGlobalStats() {
    return await this.emailTrackingService.getGlobalClickStats();
  }
}
