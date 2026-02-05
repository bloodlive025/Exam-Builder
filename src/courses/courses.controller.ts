import { Body, Controller, Post, Put, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/users/schemas/users.schema';
import { UpdateCourseDto } from './dto/update-course.dto';
@Controller('courses')
export class CoursesController {

    constructor(private coursesService: CoursesService){}

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN,UserRole.PROFESOR)
    @Post()       
    async create(@Body() createCourseDto: CreateCourseDto){
        return this.coursesService.create(createCourseDto);
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN,UserRole.PROFESOR)
    @Put()
    async update(@Body() updateCourseDto: UpdateCourseDto){
        return this.coursesService.update(updateCourseDto);
    }

}
