import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());


  const PORT = 3001;
  await app.listen(PORT, () => {
    console.log(`🎯 Start BE successfuly at http://localhost:${PORT}`);
  });
}
bootstrap();
