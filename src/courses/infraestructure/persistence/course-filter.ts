import { Types } from 'mongoose';

export interface CourseMongoFilter {
      _id?: Types.ObjectId;
      code?: { $regex: string; $options: string };
      name?: { $regex: string; $options: string };
}