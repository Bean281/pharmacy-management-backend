import { Injectable } from '@nestjs/common';
import { PrismaClient } from './generated/prisma/client.js';
import { DATABASE_URL } from 'src/common/constant/app.constant';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    const url = new URL(DATABASE_URL as string);
    console.log({ url, database: url.pathname.substring(1) });

    const adapter = new PrismaMariaDb({
      user: url.username,
      password: url.password,
      host: url.hostname,
      port: Number(url.port),
      database: url.pathname.substring(1),
    });

    super({ adapter });
  }

  // async onModuleInit() {
  //   try {
  //     await this.$queryRaw`SELECT 1+1 AS result`;
  //     console.log('✅ [PRISMA] Connection has been established successfully.');
  //   } catch (error) {
  //     console.error('❌ Unable to connect to the database:', error);
  //   }
  // }
}
