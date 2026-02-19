import { Types } from 'mongoose';

export interface ICourseFilter {
      _id?: Types.ObjectId;
      code?: { $regex: string; $options: string };
      name?: { $regex: string; $options: string };
}