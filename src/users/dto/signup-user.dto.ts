import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class SignupUserDto {
  @Length(3, 32)
  @IsNotEmpty()
  firstName: string;

  @Length(3, 32)
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Length(6)
  @IsNotEmpty()
  password: string;
}
