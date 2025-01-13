/**
 * Root controller handling base routes and server status
 * Provides basic endpoints for server health checks and favicon requests
 */

import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { AppService } from './app.service';

@Controller('/')
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Root endpoint providing server status
   * @returns Welcome message indicating server is running
   */
  @Get('/')
  @ApiOperation({ summary: 'Provides visual feedback to indicate server is running' })
  @ApiResponse({ status: 200, description: 'Returns the welcome message' })
  getRoot(): string {
    return this.appService.getRoot();
  }

  /**
   * Handle favicon requests to prevent 404 errors
   * @returns Empty string
   */
  @Get('favicon.ico')
  ignoreFaviconRequest() {
    return '';
  }
}
