import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'; // <--- Importante
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoomsModule } from './modules/rooms/rooms.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { BedTypesModule } from './modules/BedType/bed-types.module';
import { RoomTypesModule } from './modules/RoomType/room-types.module';

@Module({
  imports: [
    // 1. Cargamos el ConfigModule globalmente
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 2. Usamos 'useFactory' para esperar a que lean las variables antes de conectar
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [],
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),

    RoomsModule,

    UsersModule,

    AuthModule,

    BedTypesModule,

    RoomTypesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
