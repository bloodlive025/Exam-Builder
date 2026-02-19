import {
  Body,
  Param,
  Controller,
  Post,
  Patch,
  UseGuards,
  Get,
  Query,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { EUserRole } from 'src/users/domain/enum/user-role';
import { UpdateCourseDto } from './dto/update-course.dto';
import { FilterCourseDto } from './dto/filter-course.dto';
import { ResponseCreatedCourseDto } from './dto/response-created-course-dto';
import { ResponseUpdatedCourseDto } from './dto/response-updated-course-dto';
import { ResponseListCourseDto } from './dto/response-list-courses-dto';
import { ResponseCourseDto } from './dto/response-course-dto';
@Controller('courses')
export class CoursesController {
  constructor(private coursesService: CoursesService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(EUserRole.ADMIN, EUserRole.PROFESOR)
  @Post()
  async create(
    @Body() createCourseDto: CreateCourseDto,
  ): Promise<ResponseCreatedCourseDto> {
    const course = await this.coursesService.create(createCourseDto);
    return {...course} as ResponseCreatedCourseDto;
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(EUserRole.ADMIN, EUserRole.PROFESOR)
  @Patch(':_id')
  async update(@Param('_id') _id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ): Promise<ResponseUpdatedCourseDto> {
    const courseUpdated = await this.coursesService.update(_id, updateCourseDto);
    return { ...courseUpdated } as ResponseUpdatedCourseDto;

  }
  @UseGuards(AuthGuard)
  @Get()
  async list(@Query() filterCourseDto: FilterCourseDto) {
    const listCourses = await this.coursesService.list(filterCourseDto);
    return { ...listCourses } as ResponseListCourseDto;
  }

  @UseGuards(AuthGuard)
  @Get(':_id')
  async getById(@Param('_id') _id: string) {
    const course = await this.coursesService.getById(_id);
    return ResponseCourseDto.fromDomain(course);
  }
}