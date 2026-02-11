import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRole } from './schemas/users.schema';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register/alumno')
  async registerAlumno(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto, UserRole.ALUMNO);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('register/profesor')
  async registerProfesor(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto, UserRole.PROFESOR);
  }
}
