import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as nodeCrypto from "crypto";

if (!(global as any).crypto?.randomUUID) {
  (global as any).crypto = {
    ...(global as any).crypto,
    randomUUID: nodeCrypto.randomUUID,
  };
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen(3000);
}
bootstrap();
