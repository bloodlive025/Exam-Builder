import { IsArray, IsMongoId,IsNotEmpty, IsOptional, IsString, Min, MinLength } from "class-validator";


export class CreateCourseDto{
    @MinLength(6)
    @IsNotEmpty()
    code: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsOptional()
    @IsArray()
    @IsMongoId({each:true})
    teachers?: string[];

    @IsOptional()
    @IsArray()
    @IsMongoId({each:true})
    students?: string[];
}