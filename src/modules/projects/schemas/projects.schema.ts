import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { Professor } from '../../professors/schemas/professors.schema';

export enum ProjectStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  CLOSED = 'CLOSED',
}

@Schema({ timestamps: true })
export class ProjectFile {
  @Prop({ required: true })
  fileName: string;

  @Prop({ required: true })
  originalName: string;

  @Prop({ required: true })
  mimeType: string;

  @Prop({ required: true })
  size: number;

  @Prop({ required: true })
  uploadedAt: Date;
}

@Schema({ timestamps: true })
export class Project extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Professor', required: true })
  professor: Professor;

  @Prop({ required: true, type: [String] })
  researchCategories: string[];

  @Prop({ type: [String], required: true })
  requirements: string[];

  @Prop({
    type: String,
    enum: ProjectStatus,
    default: ProjectStatus.DRAFT,
    required: true,
  })
  status: ProjectStatus;

  @Prop({ required: true, min: 1 })
  positions: number;

  // FUTURE: Extra layer of filtering for later version.
  // @Prop({ type: [String], default: [] })
  // tags?: string[];

  @Prop()
  applicationDeadline?: Date;

  @Prop({ default: false })
  isVisible: boolean;

  @Prop({ type: [ProjectFile], default: [] })
  files: ProjectFile[];

  createdAt: Date;
  updatedAt: Date;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
