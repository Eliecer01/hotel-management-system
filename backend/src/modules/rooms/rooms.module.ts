import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // <--- Importante
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { Room } from '../../modules/rooms/entities/room.entity'; // <--- Importante
import { RoomType } from 'src/modules/RoomType/entities/room-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Room, RoomType])], // <--- Registramos ambas entidades
  controllers: [RoomsController],
  providers: [RoomsService],
})
export class RoomsModule {}
