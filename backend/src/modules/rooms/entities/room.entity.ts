import { RoomType } from 'src/modules/RoomType/entities/room-type.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

// Esto define los estados posibles de limpieza
export enum RoomStatus {
  AVAILABLE = 'AVAILABLE', // Lista para vender
  OCCUPIED = 'OCCUPIED', // Tiene huésped
  DIRTY = 'DIRTY', // Huésped salió, necesita limpieza
  MAINTENANCE = 'MAINTENANCE', // Reparaciones
}

@Entity() // Esto le dice a TypeORM: "Crea una tabla llamada 'room' en Postgres"
export class Room {
  @PrimaryGeneratedColumn() // ID Autoincremental (1, 2, 3...)
  id: number;

  @Column({ default: 1 }) // <--- Añadimos un valor por defecto
  floor: number;

  @Column({ unique: true }) // No pueden haber dos habitaciones "101"
  roomNumber: string;

  @Column({
    type: 'enum',
    enum: RoomStatus,
    default: RoomStatus.AVAILABLE,
  })
  status: RoomStatus;

  @ManyToOne(() => RoomType, { eager: true }) // eager: true carga automáticamente el tipo
  roomType: RoomType;
}
