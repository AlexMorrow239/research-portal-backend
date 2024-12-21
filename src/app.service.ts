import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  getRoot(): string {
    this.logger.debug('getRoot method called'); // This won't show up now
    return 'Research Portal API';
  }
}