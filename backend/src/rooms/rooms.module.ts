import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // <--- Importante
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { Room } from './entities/room.entity'; // <--- Importante

@Module({
  imports: [TypeOrmModule.forFeature([Room])], // <--- Aquí registramos la entidad
  controllers: [RoomsController],
  providers: [RoomsService],
})
export class RoomsModule {}
