import { Injectable, Logger } from '@nestjs/common';

import { ErrorHandler } from '@/common/utils/error-handler.util';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  getRoot(): string {
    try {
      return 'Research Portal API -- Go to /api for GUI';
    } catch (error) {
      ErrorHandler.handleServiceError(this.logger, error, 'get root message');
    }
  }
}
