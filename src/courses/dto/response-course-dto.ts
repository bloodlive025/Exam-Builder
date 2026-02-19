import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { IUser } from 'src/users/domain/interfaces/Iuser';
import { ResponseUserDto } from 'src/users/dto/response-user.dto';
import { ICourse } from '../interfaces/ICourse';
import { IProfesor } from 'src/users/domain/interfaces/IProfesor';
import { IEstudiante } from 'src/users/domain/interfaces/IEstudiante';

export class ResponseCourseDto {

  @ApiProperty({
    example: '6989ebec342c540e6bbcd92d',
    description: 'The ID of the course to update',
    required: true,
  })
  @IsNotEmpty()
  _id: string;
    
  @ApiProperty({
    example: 'CS101',
    description: 'The code of the course',
    required: true,
  })
  @MinLength(6)
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    example: 'Introduction to Computer Science',
    description: 'The name of the course',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: [ResponseUserDto] })
  @IsOptional()
  @IsArray()
  teachers?: ResponseUserDto[];

  @ApiProperty({ type: [ResponseUserDto] })
  @IsOptional()
  @IsArray()
  students?: ResponseUserDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  static fromDomain(course: ICourse<IEstudiante, IProfesor>): ResponseCourseDto {
    return {
      _id: course._id,
      code: course.code,
      name: course.name,
      teachers: course.teachers.map(ResponseUserDto.fromDomain),
      students: course.students.map(ResponseUserDto.fromDomain),
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
    };
  }

}
