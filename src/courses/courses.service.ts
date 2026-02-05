import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Course } from './schemas/courses.schema';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

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

        try{

            const {students, teachers, ...courseData} = updateCourseDto;
            const studentsSet = new Set(students);
            const teachersSet = new Set(teachers);
            updateCourseDto.students = Array.from(studentsSet);
            updateCourseDto.teachers = Array.from(teachersSet);
    
            if(updateCourseDto.students && updateCourseDto.students.length > 0){
                const studentsUsers = await this.usersService.findByIds(updateCourseDto.students);

                // Verificar que se encontraron todos
                if (studentsUsers.length !== updateCourseDto.students.length) {
                    throw new BadRequestException(
                        'Uno o más estudiantes no existen'
                    );
                }

                if (studentsUsers.some(u => u.role !== 'alumno')) {
                    throw new BadRequestException('Uno o más usuarios no son alumnos');
                }

            }

            const course = await this.courseModel.findByIdAndUpdate(updateCourseDto.id,updateCourseDto,{new:true});



            if (!course) {
                throw new NotFoundException('Curso no encontrado');
            }

            return course;

        }
        catch(error){
            if (error instanceof NotFoundException) {
                throw error;
            }



            if (error.code === 11000) {
                const field = Object.keys(error.keyPattern)[0];
                throw new BadRequestException(
                    `El ${field} ya está en uso`
                );
            }

            if (error instanceof BadRequestException) {
                throw error;
            }

        }
    }




}
