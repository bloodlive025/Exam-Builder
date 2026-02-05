import { Schema } from "@nestjs/mongoose";
import { Prop, SchemaFactory } from "@nestjs/mongoose";
import { Type } from "class-transformer";
import { Document, Types } from "mongoose";


@Schema({ timestamps: true })
export class Course extends Document {

    @Prop({required: true, unique: true, index: true})
    code: string;

    @Prop({required: true})
    title: string;

    @Prop({
        type:[{type: Types.ObjectId, ref: 'users'}],
        default: []
    })
    students: Types.ObjectId[];

    @Prop({
        type:[{type: Types.ObjectId, ref:'users'}],
        default: []
    })
    professors: Types.ObjectId[];

}



export const CourseSchema = SchemaFactory.createForClass(Course);