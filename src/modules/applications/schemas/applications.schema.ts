import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document, Schema as MongooseSchema } from 'mongoose';

import { ApplicationStatus, ProjectLength, WeeklyAvailability } from '@/common/enums';

import { Project } from '../../projects/schemas/projects.schema';

@Schema()
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

  @Prop({ required: true })
  cNumber: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ type: [String], required: true })
  racialEthnicGroups: string[];

  @Prop({ required: true })
  citizenship: string;

  @Prop({ required: true })
  academicStanding: string;

  @Prop({ required: true })
  graduationDate: Date;

  @Prop({ required: true })
  major1College: string;

  @Prop({ required: true })
  major1: string;

  @Prop({ required: true })
  hasAdditionalMajor: boolean;

  @Prop()
  major2College?: string;

  @Prop()
  major2?: string;

  @Prop({ required: true })
  isPreHealth: boolean;

  @Prop()
  preHealthTrack?: string;

  @Prop({ required: true, min: 0, max: 4.0 })
  gpa: number;
}

@Schema()
export class Availability {
  @Prop({ required: true })
  mondayAvailability: string;

  @Prop({ required: true })
  tuesdayAvailability: string;

  @Prop({ required: true })
  wednesdayAvailability: string;

  @Prop({ required: true })
  thursdayAvailability: string;

  @Prop({ required: true })
  fridayAvailability: string;

  @Prop({ type: String, enum: WeeklyAvailability, required: true })
  weeklyHours: WeeklyAvailability;

  @Prop({ type: String, enum: ProjectLength, required: true })
  desiredProjectLength: ProjectLength;
}

@Schema()
export class AdditionalInfo {
  @Prop({ required: true })
  hasPrevResearchExperience: boolean;

  @Prop()
  prevResearchExperience: string;

  @Prop({ required: true })
  researchInterestDescription: string;

  @Prop({ required: true })
  hasFederalWorkStudy: boolean;

  @Prop({ required: true })
  speaksOtherLanguages: boolean;

  @Prop()
  additionalLanguages?: string[];

  @Prop({ required: true })
  comfortableWithAnimals: boolean;
}

@Schema({ timestamps: true })
export class Application extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Project', required: true })
  project: Project;

  @Prop({ type: StudentInfo, required: true })
  studentInfo: StudentInfo;

  @Prop({ type: Availability, required: true })
  availability: Availability;

  @Prop({ type: AdditionalInfo, required: true })
  additionalInfo: AdditionalInfo;

  @Prop({ type: String, required: true })
  resumeFile: string;

  @Prop({ type: String, enum: ApplicationStatus, default: ApplicationStatus.PENDING })
  status: ApplicationStatus;

  createdAt: Date;
  updatedAt: Date;
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);
