import {
  IsString,
  IsEnum,
  IsNotEmpty,
  IsInt,
  IsPositive,
} from 'class-validator';
import { RoomStatus } from '../entities/room.entity';

export class CreateRoomDto {
  @IsInt()
  @IsPositive()
  floor: number;

  @IsString()
  @IsNotEmpty()
  roomNumber: string;

  // El estado es opcional, si no se envía, será AVAILABLE por defecto
  @IsEnum(RoomStatus)
  @IsNotEmpty()
  status: RoomStatus;

  @IsInt()
  @IsPositive()
  roomTypeId: number;
}
