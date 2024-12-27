import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { Application } from '../../applications/schemas/applications.schema';
import { Project } from '../../projects/schemas/projects.schema';

@Schema({ timestamps: true })
export class EmailTracking extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Application', required: true })
  application: Application;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Project', required: true })
  project: Project;

  @Prop({ required: true })
  token: string;

  @Prop({ default: 0 })
  clicks: number;

  @Prop({ default: null })
  lastClickedAt: Date;

  @Prop({ default: [] })
  clickTimestamps: Date[];

  @Prop({ default: null })
  firstClickedAt: Date;

  @Prop({ default: false })
  hasBeenViewed: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export const EmailTrackingSchema = SchemaFactory.createForClass(EmailTracking);

EmailTrackingSchema.index({ token: 1 }, { unique: true });
EmailTrackingSchema.index({ project: 1 });
EmailTrackingSchema.index({ application: 1 });
