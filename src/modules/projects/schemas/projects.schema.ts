import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Professor } from '../../professors/schemas/professors.schema';

export enum ProjectStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  CLOSED = 'CLOSED',
}

@Schema({ timestamps: true })
export class Project extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Professor', required: true })
  professor: Professor;

  @Prop({ required: true })
  department: string;

  @Prop({ type: [String], required: true })
  requirements: string[];

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ 
    type: String, 
    enum: ProjectStatus,
    default: ProjectStatus.DRAFT,
    required: true 
  })
  status: ProjectStatus;

  @Prop({ required: true, min: 1 })
  positions: number;

  @Prop({ type: [String], default: [] })
  tags?: string[];

  @Prop({ required: true })
  applicationDeadline: Date;

  @Prop({ default: false })
  isVisible: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);