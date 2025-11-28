import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000', // Allow requests from Next.js dev server
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
