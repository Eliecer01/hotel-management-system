import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('bed_types')
export class BedType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  name: string;
}
