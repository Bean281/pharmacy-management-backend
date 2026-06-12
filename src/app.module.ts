import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules-api/auth/auth.module';
import { PrismaModule } from './modules-system/prisma/prisma.module';
import { TokenService } from './modules-system/token/token.service';
import { TokenModule } from './modules-system/token/token.module';

@Module({
  imports: [AuthModule, PrismaModule, TokenModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
