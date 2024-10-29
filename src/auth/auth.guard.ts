import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { Request, Response } from 'express';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}
  // This method takes a response object and deletes its JWT tokens
  clearCookies(response: Response): false {
    response.clearCookie('accessToken');
    response.clearCookie('refreshToken');
    return false;
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // If the route is declared public (such as logIn/signUp), allow user in
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );

    if (isPublic) {
      return true;
    }

    // Get cookies containing JWT tokens
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { accessToken, refreshToken } = request.cookies;
    if (!accessToken || !refreshToken) return this.clearCookies(response);

    // If refresh token is invalid, delete tokens
    try {
      await this.jwtService.verifyAsync(refreshToken, {
        secret: 'refreshToken',
      });
    } catch (e) {
      return this.clearCookies(response);
    }

    // If access token is... :
    try {
      await this.jwtService.verifyAsync(accessToken, {
        secret: 'accesstoken',
      });
    } catch (error) {
      // 1) expired, refresh it
      if (error.message === 'jwt expired') {
        const { userID, email } = this.jwtService.decode(accessToken);

        // ... unless the userID does not exist
        if (!(await this.usersService.findOne(userID)))
          return this.clearCookies(response);

        const newAccessToken = await this.jwtService.signAsync(
          { userID, email },
          { secret: 'accesstoken', expiresIn: '30m' },
        );
        request.cookies.accessToken = newAccessToken;
        return true;
      }
      // 2) invalid, clear tokens
      else return this.clearCookies(response);
    }
    return true;
  }
}
