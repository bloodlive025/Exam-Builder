import { IsArray, IsMongoId, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class UpdateCourseDto{

    @IsNotEmpty()
    @IsMongoId()
    id: string;
    
    @IsOptional()
    @MinLength(6)
    code: string;
 
    @IsOptional()
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