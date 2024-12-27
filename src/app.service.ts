import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  getRoot(): string {
    return 'Research Portal API -- Go to /api for GUI';
  }
}
