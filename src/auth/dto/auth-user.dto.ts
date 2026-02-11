import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
export class AuthUserDto {
  @ApiProperty({
    example: 'user@mail.com',
    description: 'The email of the user',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'strongPassword123',
    description: 'The password of the user',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
