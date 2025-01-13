import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { DownloadTokenService } from './download-token.service';

@Module({
  imports: [JwtModule.register({}), ConfigModule],
  providers: [DownloadTokenService],
  exports: [DownloadTokenService],
})
export class DownloadTokenModule {}
