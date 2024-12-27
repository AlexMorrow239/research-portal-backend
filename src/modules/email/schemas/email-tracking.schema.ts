import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { Application } from '../../applications/schemas/applications.schema';

@Schema({ timestamps: true })
export class EmailTracking extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Application', required: true })
  application: Application;

  @Prop({ required: true })
  token: string;

  @Prop({ default: 0 })
  clicks: number;

  @Prop({ default: null })
  lastClickedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const EmailTrackingSchema = SchemaFactory.createForClass(EmailTracking);
