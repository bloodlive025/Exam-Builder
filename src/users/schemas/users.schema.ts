import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { EUserRole } from '../domain/enum/user-role';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;
  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, type: String, enum: EUserRole, default: EUserRole.ALUMNO })
  role: EUserRole;

  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
