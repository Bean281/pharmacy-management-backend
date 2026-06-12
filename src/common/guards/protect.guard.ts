import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TokenExpiredError } from '@nestjs/jwt';
import { Request } from 'express';
import { PrismaService } from 'src/modules-system/prisma/prisma.service';
import { TokenService } from 'src/modules-system/token/token.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class ProtectGuard implements CanActivate {
  // Inject Reflector vào constructor
  constructor(
    private tokenService: TokenService,
    private prisma: PrismaService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      // 1. Kiểm tra xem route hoặc controller có gắn decorator @Public() không
      const isPublic = this.reflector.getAllAndOverride<boolean>(
        IS_PUBLIC_KEY,
        [context.getHandler(), context.getClass()],
      );

      if (isPublic) {
        return true; // Nếu là public route, cho phép đi qua luôn
      }

      // 2. Logic xác thực Token cũ
      const request = context.switchToHttp().getRequest<Request>();

      const { accessToken } = request.cookies;
      // const token = this.extractTokenFromHeader(request);

      if (!accessToken) {
        throw new UnauthorizedException('Token không tìm thấy');
      }

      const decode = this.tokenService.verifyAccessToken(accessToken);
      console.log("first", decode);
      request['user'] = decode;

      const userExists = await this.prisma.user.findUnique({
        where: {
          id: decode.userId,
        },
      });

      if (!userExists) {
        throw new UnauthorizedException('User does not exist!');
      }

      return true;
    } catch (error: any) {
      switch (error.contructor) {
        case TokenExpiredError:
          throw new ForbiddenException(error.message);

        default:
          throw new UnauthorizedException();
      }
    }
  }
}
