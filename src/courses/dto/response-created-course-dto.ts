import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class ResponseCreatedCourseDto {

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

  @ApiProperty({
    example: ['teacherId1', 'teacherId2'],
    description: 'The IDs of the teachers for the course',
    required: false,
  })
  @IsOptional()
  @IsArray()
  teachers?: string[];

  @ApiProperty({
    example: ['studentId1', 'studentId2'],
    description: 'The IDs of the students for the course',
    required: false,
  })
  @IsOptional()
  @IsArray()
  students?: string[];
}
