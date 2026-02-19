import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateCourseDto {
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
    description: 'The title of the course',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: ['teacherId1', 'teacherId2'],
    description: 'The IDs of the teachers for the course',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  teachers?: string[];

  @ApiProperty({
    example: ['studentId1', 'studentId2'],
    description: 'The IDs of the students for the course',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  students?: string[];
}
