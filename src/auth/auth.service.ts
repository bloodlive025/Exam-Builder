import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AccessToken } from './interfaces/accesToken';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<AccessToken> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException('Password failed');
    }

    const payload = { sub: user._id, email: user.email, role: user.role };

    const acces_token: AccessToken = {
      access_token: this.jwtService.sign(payload),
    };

    return acces_token;
  }
}
