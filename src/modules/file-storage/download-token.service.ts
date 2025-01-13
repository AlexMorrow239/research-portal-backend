import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class DownloadTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  generateToken(professorId: string, applicationId: string): string {
    return this.jwtService.sign(
      {
        professorId,
        applicationId,
        type: 'download',
      },
      {
        secret: this.configService.get('JWT_DOWNLOAD_SECRET'),
      },
    );
  }

  verifyToken(token: string): { professorId: string; applicationId: string } {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_DOWNLOAD_SECRET'),
        ignoreExpiration: true,
      });
      return {
        professorId: payload.professorId,
        applicationId: payload.applicationId,
      };
    } catch {
      return null;
    }
  }
}
