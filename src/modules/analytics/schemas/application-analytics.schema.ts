import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class ApplicationAnalytics extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Project', required: true })
  project: MongooseSchema.Types.ObjectId;

  @Prop({ default: 0 })
  totalApplications: number;

  // MVP status counts
  @Prop({ default: 0 })
  pendingApplications: number;

  @Prop({ default: 0 })
  closedApplications: number;

  // Keep these for future use
  @Prop({ default: 0 })
  totalInterviews: number;

  @Prop({ default: 0 })
  totalAcceptedOffers: number;

  @Prop({ default: 0 })
  totalDeclinedOffers: number;

  @Prop({ default: 0 })
  totalRejected: number;

  @Prop({ default: 0 })
  totalWithdrawn: number;

  createdAt: Date;
  updatedAt: Date;
}

export const ApplicationAnalyticsSchema = SchemaFactory.createForClass(ApplicationAnalytics);
