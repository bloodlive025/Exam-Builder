import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ResponseUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;
}
