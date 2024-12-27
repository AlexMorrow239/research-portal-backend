import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Professor extends Document {
  @Prop({
    required: true,
    unique: true,
    match: /^[a-zA-Z0-9._-]+@miami\.edu$/,
  })
  email: string;

  @Prop({ required: true })
  password: string;

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
  department: string;

  @Prop()
  title?: string;

  @Prop([String])
  researchAreas?: string[];

  @Prop()
  office?: string;

  @Prop()
  phoneNumber?: string;

  @Prop({ maxlength: 1000 })
  bio?: string;

  @Prop({ default: true })
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export const ProfessorSchema = SchemaFactory.createForClass(Professor);
