import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // 1. Prefijo Global
  app.setGlobalPrefix('api');

  // 2. Validación Global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 3. CORS
  app.enableCors({
    // SOLUCIÓN 1: Agregamos <string> para decirle a TS que esto devuelve un texto
    origin:
      configService.get<string>('FRONTEND_URL') || 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // SOLUCIÓN 1 (Extra): Tipar también el puerto
  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);
}

// SOLUCIÓN 2: Usamos 'void' para decirle explícitamente que ignoramos el retorno de la promesa
void bootstrap();
