import { Body, Controller, Get, Param, Post, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { CreateTestTokenDto } from '@/common/dto/email';
import { ApiCreateTestToken, ApiGetEmailStats, ApiTrackEmailClick } from '@/common/swagger';

import { EmailTrackingService } from './email-tracking.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

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
          <h1>Research Portal</h1>
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

  @Post('test/create-token')
  @UseGuards(JwtAuthGuard)
  @ApiCreateTestToken()
  async createTestToken(@Body() body: CreateTestTokenDto) {
    return await this.emailTrackingService.createTestTrackingToken(
      body.applicationId,
      body.projectId,
    );
  }
}
