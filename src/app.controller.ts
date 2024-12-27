import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { AppService } from './app.service';

@Controller('/')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  @ApiOperation({ summary: 'Provides visual feedback to indicate server is running' })
  @ApiResponse({ status: 200, description: 'Returns the welcome message' })
  getRoot(): string {
    return this.appService.getRoot();
  }
}
