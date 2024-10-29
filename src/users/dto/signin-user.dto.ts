import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class SigninUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Length(6)
  @IsNotEmpty()
  password: string;
}
