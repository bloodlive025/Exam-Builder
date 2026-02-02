import { IsEmail, IsNotEmpty, IsString, Min, MinLength } from "class-validator";

export class ResponseUserDto{
    
    @IsEmail() 
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsString()
    name:string;

    @IsNotEmpty()
    @IsString()
    lastName:string;


}