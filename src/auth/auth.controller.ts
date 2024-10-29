import {
  Controller,
  Post,
  Body,
  HttpCode,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupUserDto } from 'src/users/dto/signup-user.dto';
import { SigninUserDto } from 'src/users/dto/signin-user.dto';
import { Response } from 'express';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @Public()
  async signUp(
    @Body() createUserDto: SignupUserDto,
    @Res() response: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.signup(createUserDto);
    return response
      .status(201)
      .cookie('accessToken', accessToken, { httpOnly: true })
      .cookie('refreshToken', refreshToken, { httpOnly: true })
      .send();
  }

  @Post('signin')
  @HttpCode(200)
  @Public()
  async signIn(
    @Body() signinUserDto: SigninUserDto,
    @Res() response: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.signin(signinUserDto);
    return response
      .cookie('accessToken', accessToken, { httpOnly: true })
      .cookie('refreshToken', refreshToken, { httpOnly: true })
      .send();
  }

  @Post('signout')
  @HttpCode(200)
  async signOut(@Res() response: Response) {
    return response
      .clearCookie('accessToken')
      .clearCookie('refreshToken')
      .send();
  }
}
