import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = +process.env.NODE_PORT || 3000;
  await app.listen(port, '0.0.0.0');

  const logger = new Logger('NestApplication');
  logger.debug(`This application is running on: ${await app.getUrl()}`);
}
bootstrap();
