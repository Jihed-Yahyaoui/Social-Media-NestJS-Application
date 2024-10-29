// https://docs.nestjs.com/techniques/cookies#creating-a-custom-decorator-cross-platform
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

type cookieNames = 'accessToken' | 'refreshToken';

export const Cookie = createParamDecorator(
  (data: cookieNames, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return data ? request.cookies?.[data] : request.cookies;
  },
);
