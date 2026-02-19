import { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Types } from 'mongoose';
export class ResponseUpdatedCourseDto {
  @ApiProperty({
    example: '6989ebec342c540e6bbcd92d',
    description: 'The ID of the course to update',
    required: true,
  })
  @IsNotEmpty()
  _id?: string;

  @ApiProperty({
    example: 'CS101',
    description: 'The code of the course',
    required: false,
  })
  @IsOptional()
  @MinLength(6)
  code: string;

  @ApiProperty({
    example: 'Introduction to Computer Science',
    description: 'The title of the course',
    required: false,
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: ['teacherId1', 'teacherId2'],
    description: 'The IDs of the teachers for the course',
    required: false,
    type: [String],
  })
  @IsArray()
  @IsMongoId({ each: true })
  teachers?: string[];

  @ApiProperty({
    example: ['studentId1', 'studentId2'],
    description: 'The IDs of the students for the course',
    required: false,
  })
  @IsArray()
  @IsMongoId({ each: true })
  students?: string[];

  @IsOptional()
  createdAt: Date;
  @IsOptional()
  updatedAt: Date;
}
