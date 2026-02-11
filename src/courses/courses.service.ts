import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Course } from './schemas/courses.schema';
import { Model, Types } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { UserRole } from 'src/users/schemas/users.schema';
import { FilterCourseDto } from './dto/filter-course.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name)
    private courseModel: Model<Course>,
    private usersService: UsersService,
  ) {}

  async create(CreateCourseDto: CreateCourseDto) {
    const { students = [], teachers = [], ...CourseData } = CreateCourseDto;

    //Validar codigo del curso
    const existingCourse = await this.courseModel.findOne({
      code: CourseData.code,
    });

    if (existingCourse) {
      throw new BadRequestException('Course with this code already exists');
    }

    const studentsUsers = await this.usersService.findByIds(students ?? []);
    if (studentsUsers.some((u) => u.role !== UserRole.ALUMNO)) {
      throw new BadRequestException('Uno o más usuarios no son alumnos');
    }

    const teachersUsers = await this.usersService.findByIds(teachers ?? []);
    if (teachersUsers.some((u) => u.role !== UserRole.PROFESOR)) {
      throw new BadRequestException('Uno o más usuarios no son profesores');
    }

    const newCourse = new this.courseModel({
      ...CourseData,
      students,
      teachers,
    });
    return newCourse.save();
  }

  async update(updateCourseDto: UpdateCourseDto) {
    const { students, teachers, ...courseData } = updateCourseDto;
    const validStudents = await this.validateUsersInCourse(
      students,
      UserRole.ALUMNO,
    );
    const validTeachers = await this.validateUsersInCourse(
      teachers,
      UserRole.PROFESOR,
    );

    const course = await this.courseModel.findByIdAndUpdate(
      updateCourseDto.id,
      {
        ...courseData,
        ...(validStudents.length > 0 ? { students: validStudents } : {}),
        ...(validTeachers.length > 0 ? { teachers: validTeachers } : {}),
      },
      { new: true },
    );

    if (!course) {
      throw new NotFoundException('Curso no encontrado');
    }

    return course;
  }

  private async validateUsersInCourse(
    ids: string[] | undefined,
    role: UserRole.ALUMNO | UserRole.PROFESOR,
  ) {
    if (!ids?.length) return [];
    const uniqueIds = [...new Set(ids)];
    const users = await this.usersService.findByIds(uniqueIds);
    if (users.length !== uniqueIds.length) {
      throw new BadRequestException(`Uno o más ${role} no existen`);
    }

    if (users.some((u) => u.role !== role)) {
      throw new BadRequestException(`Uno o más usuarios no son ${role}`);
    }

    return uniqueIds;
  }

  async list(filterCourseDto: FilterCourseDto) {
    const { code, title, id, page, size } = filterCourseDto;

    interface CourseFilter {
      _id?: Types.ObjectId;
      code?: { $regex: string; $options: string };
      title?: { $regex: string; $options: string };
    }

    const filter: CourseFilter = {};

    if (id) {
      filter._id = new Types.ObjectId(id);
    }

    if (code) {
      filter.code = { $regex: code, $options: 'i' };
    }

    if (title) {
      filter.title = { $regex: title, $options: 'i' };
    }

    const skip = page * size;

    const [content, totalElements] = await Promise.all([
      this.courseModel.find(filter).skip(skip).limit(size).exec(),
      this.courseModel.countDocuments(filter),
    ]);

    return content.length > 0
      ? {
          content,
          totalElements,
          page,
          size,
        }
      : {
          content: [],
          totalElements: 0,
          page,
          size,
        };
  }
}
