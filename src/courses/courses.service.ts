import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Course, CourseDocument } from './schemas/courses.schema';
import { Model, Types } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { EUserRole } from 'src/users/domain/enum/user-role';
import { FilterCourseDto } from './dto/filter-course.dto';
import { ICourse } from './interfaces/ICourse';
import { ICourseFilter } from './interfaces/ICouseFilter';
import { IPagedResult } from 'src/common/middleware/interfaces/IPagedResult';
import { IEstudiante } from 'src/users/domain/interfaces/IEstudiante';
import { IProfesor } from 'src/users/domain/interfaces/IProfesor';
@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name)
    private courseModel: Model<CourseDocument>,
    private usersService: UsersService,
  ) {}

  

  async create(CreateCourseDto: CreateCourseDto): Promise<ICourse> {
    const { students = [], teachers = [], ...CourseData } = CreateCourseDto;

    //Validar codigo del curso
    const existingCourse = await this.courseModel.findOne({
      code: CourseData.code,
    });

    if (existingCourse) {
      throw new BadRequestException('Course with this code already exists');
    }

    const studentsUsers = await this.validateUsersInCourse(
      students,
      EUserRole.ALUMNO,
    );

    const teachersUsers = await this.validateUsersInCourse(
      teachers,
      EUserRole.PROFESOR,
    );

    const newCourse = new this.courseModel({
      ...CourseData,
      students: studentsUsers,
      teachers: teachersUsers,
    });
    const savedCourse = await newCourse.save();

    const course: ICourse = this.toDomain(savedCourse);
    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    const { students, teachers, ...courseData } = updateCourseDto;
    const validStudents = await this.validateUsersInCourse(
      students,
      EUserRole.ALUMNO,
    );
    const validTeachers = await this.validateUsersInCourse(
      teachers,
      EUserRole.PROFESOR,
    );
    
    const course = await this.courseModel
      .findByIdAndUpdate(
        id,
        {
          ...courseData,
          ...(validStudents.length > 0 ? { students: validStudents } : {}),
          ...(validTeachers.length > 0 ? { teachers: validTeachers } : {}),
        },
        { new: true },
      )
      .exec();

    if (!course) {
      throw new NotFoundException('Curso no encontrado');
    }

    const updatedCourse: ICourse = this.toDomain(course);

    return updatedCourse;
  }

  private async validateUsersInCourse(
    ids: string[] | undefined,
    role: EUserRole.ALUMNO | EUserRole.PROFESOR,
  ): Promise<string[]> {
    if (!ids?.length) return [];

    const uniqueIds = [...new Set(ids)]; // Eliminar IDs duplicados usando conjuntos
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
    const { code, name, _id, page, size } = filterCourseDto;

    const filter: ICourseFilter = {};

    if (_id) {
      filter._id = new Types.ObjectId(_id);
    }

    if (code) {
      filter.code = { $regex: code, $options: 'i' };
    }

    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }

    const skip = page * size;

    const [content, totalElements] = await Promise.all([
      this.courseModel.find(filter).skip(skip).limit(size).exec(),
      this.courseModel.countDocuments(filter),
    ]);

    const contentToDomain = content.map((course) => this.toDomain(course));
    const PageResponse:IPagedResult<ICourse> = {
      content: contentToDomain,
      totalElements,
      page,
      size,
    }

    return PageResponse;

  }

  async getById(id: string): Promise<ICourse<IEstudiante, IProfesor>> {
    const course = await this.courseModel.findById(id).exec();
    
    if (!course) {
      throw new NotFoundException('Curso no encontrado');
    }

    const [students, teachers] = await Promise.all([
      this.usersService.findByIds(course.students),
      this.usersService.findByIds(course.teachers),
    ]);

    const studentsDomain = students.map((user) => this.usersService.toDomain(user) as IEstudiante);
    const teachersDomain = teachers.map((user) => this.usersService.toDomain(user) as IProfesor);

    return this.toDomainExtended(course, studentsDomain , teachersDomain);
  }

  private toDomain(course: CourseDocument): ICourse {
    return {
      _id: course._id.toString(),
      code: course.code,
      name: course.name,
      students: course.students.map((id) => id.toString()),
      teachers: course.teachers.map((id) => id.toString()),
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
    };
  }

  private toDomainExtended(course: CourseDocument, students: IEstudiante[], teachers: IProfesor[]): ICourse<IEstudiante, IProfesor> {
    return {
      _id: course._id.toString(),
      code: course.code,
      name: course.name,
      students: students,
      teachers: teachers,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
    };
  }
}
