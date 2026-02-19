import { ConflictException, Injectable } from '@nestjs/common';
import { User, UserDocument } from './schemas/users.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose/dist/common/mongoose.decorators';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { EUserRole } from './domain/enum/user-role';
import { IEstudiante } from './domain/interfaces/IEstudiante';
import { IProfesor } from './domain/interfaces/IProfesor';
import { IAdmin } from './domain/interfaces/IAdmin';
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(
    createUserDto: CreateUserDto,
    role: EUserRole,
  ): Promise<IEstudiante | IProfesor | IAdmin> {
    const ExistingUser = await this.userModel.findOne({
      email: createUserDto.email,
    });

    if (ExistingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10); // TODO: Hash password before saving

    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
      role,
    });

    const savedUser = await newUser.save();

    const responseToController = this.toDomain(savedUser.toObject());
    return responseToController;
  }

  toDomain(user: UserDocument): IEstudiante | IProfesor | IAdmin {
    return {
      _id: user._id.toString(),
      email: user.email,
      password: user.password,
      name: user.name,
      lastName: user.lastName,
      role: user.role,
      joinedAt: user.createdAt,
    };
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    const ExistingUser = await this.userModel.findOne({ email: email });
    return ExistingUser;
  }

  async findByIds(ids: (string | Types.ObjectId)[]): Promise<UserDocument[]> { 
    const users = await this.userModel.find({
      _id: { $in: ids },
    });
    return users;
  }
}
