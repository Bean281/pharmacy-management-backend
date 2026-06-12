import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/modules-system/prisma/prisma.service';
import { TokenService } from 'src/modules-system/token/token.service';
import { ROLE_KEY } from '../decorators/role.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private prisma: PrismaService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const role = this.reflector.getAllAndOverride<boolean>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // tìm ra người đang gọi api này, thì có thể lấy req.user ở guard Protect
    // khi mà có user rồi thì lấy key role (cột role trong db)
    // role của user (DB) === role (decorator)
    // nếu không === thì trả false
    // nếu bằng === thì trả true
    // console.log('RoleGuard', { role });

    return true;
  }
}
