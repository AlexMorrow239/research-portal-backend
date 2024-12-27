import { Body, Controller, Get, Param, Post, Res, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { Response } from 'express';

import { CreateTestTokenDto } from './dto/create-test-token.dto';
import { GlobalStatsDto } from './dto/global-stats.dto';
import { EmailTrackingService } from './email-tracking.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Email Tracking')
@Controller('api/track')
export class EmailTrackingController {
  constructor(private readonly emailTrackingService: EmailTrackingService) {}

  @Get(':token')
  @ApiOperation({ summary: 'Track email click and redirect' })
  @ApiParam({
    name: 'token',
    description: 'Email tracking token',
    example: 'abc123-def456',
  })
  @ApiResponse({
    status: 200,
    description: 'Click tracked successfully',
  })
  @ApiNotFoundResponse({ description: 'Invalid tracking token' })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get global email tracking statistics' })
  @ApiResponse({
    status: 200,
    description: 'Global statistics retrieved successfully',
    type: GlobalStatsDto,
  })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async getGlobalStats() {
    return await this.emailTrackingService.getGlobalClickStats();
  }

  @Post('test/create-token')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a test tracking token',
    description: 'Create a tracking token for testing purposes. Not available in production.',
  })
  @ApiBody({ type: CreateTestTokenDto })
  @ApiResponse({
    status: 201,
    description: 'Test token created successfully',
    schema: {
      properties: {
        token: { type: 'string', example: 'abc123-def456' },
        tracking: {
          type: 'object',
          properties: {
            application: { type: 'string', example: '507f1f77bcf86cd799439011' },
            project: { type: 'string', example: '507f1f77bcf86cd799439012' },
            token: { type: 'string', example: 'abc123-def456' },
            clicks: { type: 'number', example: 0 },
            hasBeenViewed: { type: 'boolean', example: false },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiBadRequestResponse({ description: 'Invalid request body' })
  async createTestToken(@Body() body: CreateTestTokenDto) {
    return await this.emailTrackingService.createTestTrackingToken(
      body.applicationId,
      body.projectId,
    );
  }
}
