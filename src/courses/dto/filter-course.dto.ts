import { IsMongoId, IsOptional, IsString } from 'class-validator';
import { PageableDto } from './pageable.dto';
import { ApiProperty } from '@nestjs/swagger';

export class FilterCourseDto extends PageableDto {
  @ApiProperty({
    example: '6989ebec342c540e6bbcd92d',
    description: 'The ID of the course to update',
    required: true,
  })
  @IsOptional()
  @IsMongoId()
  _id?: string;

  @ApiProperty({
    example: 'CS101',
    description: 'The code of the course',
    required: false,
  })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({
    example: 'Introduction to Computer Science',
    description: 'The title of the course',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;
}
