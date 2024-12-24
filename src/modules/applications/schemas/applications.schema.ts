import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Project } from '../../projects/schemas/projects.schema';

export enum ApplicationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN'
}

@Schema({ timestamps: true })
export class StudentInfo {
  @Prop({
    type: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
    },
    required: true,
  })
  name: {
    firstName: string;
    lastName: string;
  };

  @Prop({
    required: true,
    match: /^[a-zA-Z0-9._-]+@miami\.edu$/,
  })
  email: string;

  @Prop({ required: true })
  major: string;

  @Prop({ required: true, min: 0, max: 4.0 })
  gpa: number;

  @Prop({ required: true })
  expectedGraduation: Date;
}

@Schema({ timestamps: true })
export class Application extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Project', required: true })
  project: Project;

  @Prop({ type: StudentInfo, required: true })
  studentInfo: StudentInfo;

  @Prop({ required: true })
  statement: string;

  @Prop({ type: String, required: true })
  resumeFile: string;

  @Prop({ type: String, enum: ApplicationStatus, default: ApplicationStatus.PENDING })
  status: ApplicationStatus;

  @Prop()
  professorNotes?: string;

  createdAt: Date;
  updatedAt: Date;
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);