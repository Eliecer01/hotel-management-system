import { BedType } from 'src/modules/BedType/entities/bed-type.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity('room_types')
export class RoomType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  pricePerNight: number;

  @ManyToMany(() => BedType, { eager: true, cascade: true })
  @JoinTable({
    name: 'room_type_beds', // nombre de la tabla intermedia
    joinColumn: { name: 'roomTypeId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'bedTypeId', referencedColumnName: 'id' },
  })
  beds: BedType[];
}
