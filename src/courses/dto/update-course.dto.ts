import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class UpdateCourseDto {
  @ApiProperty({
    example: '6989ebec342c540e6bbcd92d',
    description: 'The ID of the course to update',
    required: true,
  })
  @IsNotEmpty()
  @IsMongoId()
  id: string;

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
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty({
    example: ['teacherId1', 'teacherId2'],
    description: 'The IDs of the teachers for the course',
    required: false,
    type: [String],
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
