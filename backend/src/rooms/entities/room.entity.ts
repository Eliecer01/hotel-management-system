import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ unique: true }) // No pueden haber dos habitaciones "101"
  roomNumber: string;

  @Column() // Ejemplo: "Suite Matrimonial", "Simple"
  type: string;

  @Column('decimal', { precision: 10, scale: 2 }) // Usamos decimal para dinero, NUNCA float
  pricePerNight: number;

  @Column({
    type: 'enum',
    enum: RoomStatus,
    default: RoomStatus.AVAILABLE,
  })
  status: RoomStatus;
}
