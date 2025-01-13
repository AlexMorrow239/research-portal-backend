import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { DownloadTokenService } from './download-token.service';

// Generates secure URLs for file downloads
@Injectable()
export class DownloadUrlService {
  constructor(
    private readonly configService: ConfigService,
    private readonly downloadTokenService: DownloadTokenService,
    private readonly logger: Logger,
  ) {}

  generateDownloadUrl(projectId: string, applicationId: string, professorId: string): string {
    try {
      const apiUrl = this.configService.get<string>('API_URL');
      if (!apiUrl) {
        throw new Error('API_URL environment variable is not configured');
      }

      const cleanProjectId = this.extractId(projectId);
      const cleanProfessorId = this.extractId(professorId);
      const downloadToken = this.downloadTokenService.generateToken(
        cleanProfessorId,
        applicationId,
      );

      return `${apiUrl}/projects/${cleanProjectId}/applications/download/${downloadToken}`;
    } catch (error) {
      this.logger.error('Failed to generate download URL:', {
        error: error.message,
        projectId,
        applicationId,
        professorId,
      });
      throw error;
    }
  }

  private extractId(value: any): string {
    return value?._id ?? value;
  }
}
