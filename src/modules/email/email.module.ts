import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { EmailConfigService } from './config/email.config';
import { EmailTemplateService } from './email-template.service';
import { EmailService } from './email.service';

@Module({
  imports: [ConfigModule],
  providers: [EmailService, EmailConfigService, EmailTemplateService, Logger],
  exports: [EmailService],
})
export class EmailModule {}
