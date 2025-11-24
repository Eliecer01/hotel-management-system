import { IsString, IsNumber, IsEnum, IsNotEmpty, Min } from 'class-validator';
import { RoomStatus } from '../entities/room.entity';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  roomNumber: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsNumber()
  @Min(0) // El precio no puede ser negativo
  pricePerNight: number;

  // El estado es opcional, si no se envía, será AVAILABLE por defecto
  @IsEnum(RoomStatus)
  @IsNotEmpty()
  status: RoomStatus;
}
