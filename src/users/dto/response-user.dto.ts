import {
  IsDate,
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { EUserRole } from '../domain/enum/user-role';
import { IEstudiante } from '../domain/interfaces/IEstudiante';
import { IProfesor } from '../domain/interfaces/IProfesor';
import { IAdmin } from '../domain/interfaces/IAdmin';

export class ResponseUserDto {
  @IsMongoId()
  @IsNotEmpty()
  id: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  role: EUserRole;

  @IsNotEmpty()
  @IsDate()
  joinedAt: Date;

  static fromDomain(user: IAdmin|IEstudiante|IProfesor): ResponseUserDto {
    return {
      id: user._id,
      email: user.email,
      name: user.name,
      lastName: user.lastName,
      role: user.role,
      joinedAt: user.joinedAt,
    };
  }
}
