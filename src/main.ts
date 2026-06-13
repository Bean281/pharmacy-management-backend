import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());

   const config = new DocumentBuilder()
    .setTitle('Phamarcy Management')
    .setDescription('The api for pharmacy management website.')
    .setVersion('1.0')
    .addTag('pharmacy-management')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);


  const PORT = 3001;
  await app.listen(PORT, () => {
    console.log(`🎯 Start BE successfuly at http://localhost:${PORT}`);
  });
}
bootstrap();
