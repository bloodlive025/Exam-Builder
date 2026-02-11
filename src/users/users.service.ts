import { ConflictException, Injectable } from '@nestjs/common';
import { User, UserRole } from './schemas/users.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose/dist/common/mongoose.decorators';
import { CreateUserDto } from './dto/create-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto, role: UserRole) {
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
      role: role,
    });

    const savedUser = await newUser.save();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = savedUser.toObject();

    const respondeUserDto: ResponseUserDto = userWithoutPassword;

    return respondeUserDto;
  }

  async findByEmail(email: string): Promise<User | null> {
    const ExistingUser = await this.userModel.findOne({ email: email });
    return ExistingUser;
  }

  async findByIds(ids: string[]): Promise<User[]> {
    const users = await this.userModel.find({
      _id: { $in: ids },
    });
    return users;
  }
}
