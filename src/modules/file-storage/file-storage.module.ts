import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { DownloadTokenService } from './download-token.service';
import { DownloadUrlService } from './download-url.service';
import { FileStorageService } from './file-storage.service';

@Module({
  imports: [ConfigModule, JwtModule.register({})],
  providers: [FileStorageService, DownloadTokenService, DownloadUrlService, Logger],
  exports: [FileStorageService, DownloadTokenService, DownloadUrlService],
})
export class FileStorageModule {}
