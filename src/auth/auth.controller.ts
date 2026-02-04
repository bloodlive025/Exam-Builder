import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Body } from '@nestjs/common';
import { AuthUserDto } from './dto/auth-user.dto';
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() signInDto: AuthUserDto){
        return this.authService.signIn(signInDto.email, signInDto.password);
    }

}
