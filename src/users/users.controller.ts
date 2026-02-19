import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ResponseUserDto } from './dto/response-user.dto';
import { EUserRole } from './domain/enum/user-role';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register/alumno')
  async registerAlumno(@Body() createUserDto: CreateUserDto) {
    const Alumno = await this.usersService.create(
      createUserDto,
      EUserRole.ALUMNO,
    );
    return ResponseUserDto.fromDomain(Alumno);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(EUserRole.ADMIN)
  @Post('register/profesor')
  async registerProfesor(@Body() createUserDto: CreateUserDto) {
    const Profesor = await this.usersService.create(
      createUserDto,
      EUserRole.PROFESOR,
    );
    
    return ResponseUserDto.fromDomain(Profesor);
  }
}
