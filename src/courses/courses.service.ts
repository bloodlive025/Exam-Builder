import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Course } from './schemas/courses.schema';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { User, UserRole } from 'src/users/schemas/users.schema';

@Injectable()
export class CoursesService {
    
    constructor(@InjectModel(Course.name)
        private courseModel: Model<Course>,
        private usersService: UsersService
    ){}

    async create(CreateCourseDto:CreateCourseDto){
        const {students=[],teachers=[], ...CourseData} = CreateCourseDto;

        //Validar codigo del curso
        const existingCourse = await this.courseModel.findOne({code: CourseData.code});

        if(existingCourse){
            throw new BadRequestException('Course with this code already exists');
        }


        const studentsUsers = await this.usersService.findByIds(students ?? []);
        if (studentsUsers.some(u => u.role !== 'alumno')) {
            throw new BadRequestException('Uno o más usuarios no son alumnos');
        }   

        const teachersUsers = await this.usersService.findByIds(teachers ?? []);
        if (teachersUsers.some(u => u.role !== 'profesor')) {
            throw new BadRequestException('Uno o más usuarios no son profesores');
        }

        const newCourse = new this.courseModel({
            ...CourseData,
            students,
            teachers
        });
        return newCourse.save();
    }

    async update(updateCourseDto:UpdateCourseDto){

       
        const {students, teachers, ...courseData} = updateCourseDto;
        const validStudents = await this.validateUsersInCourse(students, UserRole.ALUMNO);
        const validTeachers = await this.validateUsersInCourse(teachers, UserRole.PROFESOR);


        const course = await this.courseModel.findByIdAndUpdate(updateCourseDto.id,{...courseData,  
            ...(validStudents.length > 0 ? { students: validStudents } : {}),
            ...(validTeachers.length > 0 ? { teachers: validTeachers } : {}),
        }, {new: true});
        
        if (!course) {
            throw new NotFoundException('Curso no encontrado');
        }


        return course;  
       
    }

    private async validateUsersInCourse(ids: string[] | undefined, role: UserRole.ALUMNO | UserRole.PROFESOR) {
        if (!ids?.length) return [];
        const uniqueIds = [...new Set(ids)];
        const users = await this.usersService.findByIds(uniqueIds);
        if (users.length !== uniqueIds.length) {
            throw new BadRequestException(`Uno o más ${role} no existen`);
        }

        if(users.some(u => u.role !== role)){
            throw new BadRequestException(`Uno o más usuarios no son ${role}`);
        }

        return uniqueIds;

    }


}
