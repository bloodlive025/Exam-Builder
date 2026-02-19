import { Schema } from '@nestjs/mongoose';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Course {
  @Prop({ required: true, unique: true, index: true })
  code: string;

  @Prop({ required: true })
  name: string;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'users' }],
    default: [],
  })
  students: Types.ObjectId[];

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'users' }],
    default: [],
  })
  teachers: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export type CourseDocument = HydratedDocument<Course>;

export const CourseSchema = SchemaFactory.createForClass(Course);
