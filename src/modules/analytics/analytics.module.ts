import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import {
  ApplicationAnalytics,
  ApplicationAnalyticsSchema,
} from './schemas/application-analytics.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ApplicationAnalytics.name, schema: ApplicationAnalyticsSchema },
    ]),
  ],
  providers: [AnalyticsService],
  controllers: [AnalyticsController],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
