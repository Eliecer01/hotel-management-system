import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoomsModule } from './rooms/rooms.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin', // Definido en tu docker-compose
      password: 'root', //  Definido en tu docker-compose
      database: 'hotel_db', // Definido en tu docker-compose
      entities: [], // Aquí irán tus tablas (Room, Guest, etc.)
      autoLoadEntities: true, // Carga automáticamente las entidades registradas
      synchronize: true, // ¡OJO! Esto crea las tablas automáticamente (solo para desarrollo)
    }),
    RoomsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
