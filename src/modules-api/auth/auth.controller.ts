import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { RegisterDto } from './dto/register.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { User } from 'src/common/decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @Public()
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(loginDto);

    res.cookie('accessToken', result.accessToken);
    res.cookie('refreshToken', result.refreshToken);

    return true;
  }

  @Post('register')
  @Public()
  async register(@Body() registerDto: RegisterDto) {
    const result = await this.authService.register(registerDto);
    return result;
  }

  @Post('refresh-token')
  async refreshToken(@Req() req:Request, @Res({passthrough: true}) res:Response) {
    const result = await this.authService.refreshToken(req);

    res.cookie('accessToken', result.accessToken);
    res.cookie('refreshToken', result.refreshToken);

    return true;
  }

  @Get('get-info')
  async getInfo(@User() user: any) {
    const result = await this.authService.getInfo(user.userId);
    return result;
  }

  @Post('logout')
  logout(@Res({passthrough: true}) res: Response) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    return {
      message: 'Logout successfully'
    }
  }
  
}
