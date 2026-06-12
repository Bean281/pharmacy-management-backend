import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules-system/prisma/prisma.service';
import { TokenService } from 'src/modules-system/token/token.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { Request } from 'express';

interface JwtPayloadWithUserId {
  userId: number;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private tokenService: TokenService,
  ) {}

  async login(body: LoginDto) {
    const {email, password, token} = body;

    const userExist = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
      omit: {
        password: false,
      }
    })

    if (!userExist) {
      throw new BadRequestException("The user does not exist!")
    }

    if (!userExist.password) {
      throw new BadRequestException("You need to login by Google to update password!")
    }

    const isPassword = bcrypt.compareSync(password, userExist.password);

    if (!isPassword) {
      throw new BadRequestException("Wrong password!")
    }

    const accessToken = this.tokenService.createAccessToken(userExist.id);
    const refreshToken = this.tokenService.createRefreshToken(userExist.id);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken
    }

  }

  async register(body: RegisterDto) {
    const {email, password, fullName} = body;

    const userExist = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });


    if (userExist) {
      throw new BadRequestException('User existed, please continue to login or assign new email!');
    }

    const passwordHash = bcrypt.hashSync(password, 10);

    const userNew = await this.prisma.user.create({
      data: {
        email: email,
        password: passwordHash,
        fullName: fullName,
      }
    })

    console.log("New User", userNew);

    return true;
  }

  async refreshToken(req) {
    const {accessToken, refreshToken} = req.cookies;

    if (!accessToken) {
      throw new BadRequestException('There is no access token exist!');
    }

    if (!refreshToken) {
      throw new BadRequestException('There is no refresh token exist!');
    }

    const decodeAccessToken = this.tokenService.verifyAccessToken(accessToken, {
      ignoreExpiration: true,
    });

    const decodeRefreshToken = this.tokenService.verifyRefreshToken(refreshToken);

    if (decodeAccessToken.userId !== decodeRefreshToken.userId) {
      throw new BadRequestException('Token is not available!')
    }

    const userExist = await this.prisma.user.findUnique ({
      where: {
        id: decodeAccessToken.userId
      }
    })

    if (!userExist) {
      throw new BadRequestException('There is no user in DB');
    }

    const accessTokenNew = this.tokenService.createAccessToken(userExist.id);
    const refreshTokenNew = this.tokenService.createRefreshToken(userExist.id);

    return {
      accessToken: accessTokenNew,
      refreshToken: refreshTokenNew
    }

  }

  // create(createAuthDto: CreateAuthDto) {  
  //   return 'This action adds a new auth';
  // }

  // findAll() {
  //   return `This action returns all auth`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} auth`;
  // }

  // update(id: number, updateAuthDto: UpdateAuthDto) {
  //   return `This action updates a #${id} auth`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} auth`;
  // }
}
