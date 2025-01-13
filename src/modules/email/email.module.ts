import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { FileStorageModule } from '@/modules/file-storage/file-storage.module';

import { EmailConfigService } from './config/email.config';
import { EmailTemplateService } from './email-template.service';
import { EmailService } from './email.service';

@Module({
  imports: [ConfigModule, FileStorageModule],
  providers: [EmailService, EmailConfigService, EmailTemplateService, Logger],
  exports: [EmailService],
})
export class EmailModule {}
