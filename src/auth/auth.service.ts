import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(private usersService:UsersService,
        private jwtService: JwtService
    ){}

    async signIn(email:string, pass:string):Promise<{ access_token: string }> {


        const user = await this.usersService.findByEmail(email);

        if(!user){
            throw new UnauthorizedException("User not found");
        }

        if(!(await bcrypt.compare(pass, user.password))){
            throw new UnauthorizedException("Password failed");
        }

        const payload = { sub: user?._id,email: user?.email, role: user?.role };

        const {password, ...result} = user?.toObject();
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    
    }

}
