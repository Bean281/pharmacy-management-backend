import { BadRequestException, Injectable } from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "src/common/constant/app.constant";

export interface TokenPayload {
  userId: number;
}

@Injectable()
export class TokenService {
    createAccessToken(userId) {
        if(!userId) {
            throw new BadRequestException("There is no userId to create token!");
        }

        const accessToken = jwt.sign({userId: userId}, ACCESS_TOKEN_SECRET as string, {expiresIn: '15m'} );

        return accessToken;
    }

    createRefreshToken(userId) {
        if(!userId) {
            throw new BadRequestException("There is no userId to create token!");
        }

        const accessToken = jwt.sign({userId: userId}, REFRESH_TOKEN_SECRET as string, {expiresIn: '1d'} );

        return accessToken;
    }

    verifyAccessToken(accessToken, option?:jwt.VerifyOptions): TokenPayload {
        const decode = jwt.verify(accessToken, ACCESS_TOKEN_SECRET as string, option) as TokenPayload;
        return decode;
    }

    verifyRefreshToken(refreshToken, option?:jwt.VerifyOptions): TokenPayload {
        const decode = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET as string, option) as TokenPayload;
        return decode;
    }
}

