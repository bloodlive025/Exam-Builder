import { IsEmail, IsNotEmpty, IsString, Min, MinLength } from "class-validator";

export class CreateUserDto{
    
    @IsEmail() 
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password:string;

    @IsNotEmpty()
    @IsString()
    name:string;

    @IsNotEmpty()
    @IsString()
    lastName:string;

    


}