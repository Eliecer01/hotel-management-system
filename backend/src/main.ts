import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ESTA ES LA LÍNEA MÁGICA QUE FALTABA
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades que no estén en el DTO (Seguridad)
      forbidNonWhitelisted: true, // Lanza error si envían datos extra basura
      transform: true, // Convierte "1" (string) a 1 (número) automáticamente
    }),
  );

  // Habilitar CORS por si el Frontend (puerto 5173) quiere hablar con el Backend (3000)
  app.enableCors();

  await app.listen(3000);
}
bootstrap();
