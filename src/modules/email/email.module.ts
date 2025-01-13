import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose'; // Add this

import { FileStorageModule } from '@/modules/file-storage/file-storage.module';

import { EmailConfigService } from './config/email.config';
import { EmailTemplateService } from './email-template.service';
import { EmailTrackingController } from './email-tracking.controller';
import { EmailTrackingService } from './email-tracking.service';
import { EmailService } from './email.service';
import { EmailTracking, EmailTrackingSchema } from './schemas/email-tracking.schema';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: EmailTracking.name, schema: EmailTrackingSchema }]),
    FileStorageModule,
  ],
  controllers: [EmailTrackingController],
  providers: [EmailService, EmailConfigService, EmailTemplateService, EmailTrackingService, Logger],
  exports: [EmailService, EmailTrackingService],
})
export class EmailModule {}
