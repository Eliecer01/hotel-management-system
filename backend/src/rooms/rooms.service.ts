import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoomsService {
  // Inyectamos el Repositorio de TypeORM
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
  ) {}

  // Crear una habitación
  async create(createRoomDto: CreateRoomDto) {
    // Crea el objeto en memoria
    const room = this.roomRepository.create(createRoomDto);
    // Lo guarda en la DB (INSERT INTO...)
    return await this.roomRepository.save(room);
  }

  // Obtener todas las habitaciones
  async findAll() {
    return await this.roomRepository.find();
  }

  // Obtener una por ID
  async findOne(id: number) {
    const room = await this.roomRepository.findOneBy({ id });
    if (!room) {
      throw new NotFoundException(`La habitación con ID ${id} no existe`);
    }
    return room;
  }

  // Actualizar una habitación
  async update(id: number, updateRoomDto: UpdateRoomDto) {
    // Primero verificamos que exista (reutilizamos findOne)
    const room = await this.findOne(id);
    // Fusionamos los cambios
    this.roomRepository.merge(room, updateRoomDto);
    // Guardamos
    return await this.roomRepository.save(room);
  }

  // Eliminar una habitación
  async remove(id: number) {
    const room = await this.findOne(id);
    return await this.roomRepository.remove(room);
  }
}
