/**
 * Root service handling base application logic
 * Provides core functionality for the root controller
 */

import { Injectable, Logger } from '@nestjs/common';

import { ErrorHandler } from '@/common/utils/error-handler.util';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  /**
   * Returns the root welcome message
   * @returns Welcome message string
   * @throws Will be caught and handled by ErrorHandler
   */
  getRoot(): string {
    try {
      return 'Research Engine API -- Go to /api for GUI';
    } catch (error) {
      ErrorHandler.handleServiceError(this.logger, error, 'get root message');
    }
  }
}
