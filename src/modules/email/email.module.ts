import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose'; // Add this

import { EmailConfigService } from './config/email.config';
import { EmailTemplateService } from './email-template.service';
import { EmailTrackingService } from './email-tracking.service';
import { EmailService } from './email.service';
import { EmailTracking, EmailTrackingSchema } from './schemas/email-tracking.schema'; // Add Schema

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: EmailTracking.name, schema: EmailTrackingSchema }]), // Add this
  ],
  providers: [EmailService, EmailConfigService, EmailTemplateService, EmailTrackingService, Logger],
  exports: [EmailService],
})
export class EmailModule {}
