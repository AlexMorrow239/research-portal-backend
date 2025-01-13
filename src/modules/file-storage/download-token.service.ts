import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

interface DownloadTokenPayload {
  professorId: string;
  applicationId: string;
  type: 'download';
}

// Manages secure download tokens for file access
@Injectable()
export class DownloadTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  generateToken(professorId: string, applicationId: string): string {
    const payload: DownloadTokenPayload = {
      professorId,
      applicationId,
      type: 'download',
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_DOWNLOAD_SECRET'),
    });
  }

  verifyToken(token: string): { professorId: string; applicationId: string } | null {
    try {
      const payload = this.jwtService.verify<DownloadTokenPayload>(token, {
        secret: this.configService.get('JWT_DOWNLOAD_SECRET'),
        ignoreExpiration: true,
      });

      if (payload.type !== 'download') return null;

      return {
        professorId: payload.professorId,
        applicationId: payload.applicationId,
      };
    } catch {
      return null;
    }
  }
}
