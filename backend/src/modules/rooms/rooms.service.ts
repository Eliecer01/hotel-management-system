import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { RoomType } from 'src/modules/RoomType/entities/room-type.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoomsService {
  // Inyectamos el Repositorio de TypeORM
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @InjectRepository(RoomType)
    private readonly roomTypeRepository: Repository<RoomType>,
  ) {}

  // Crear una habitación
  async create(createRoomDto: CreateRoomDto) {
    const { roomTypeId, ...roomData } = createRoomDto;

    const roomType = await this.roomTypeRepository.findOneBy({
      id: roomTypeId,
    });
    if (!roomType) {
      throw new NotFoundException(
        `El tipo de habitación con ID ${roomTypeId} no existe.`,
      );
    }

    // Crea el objeto en memoria
    const room = this.roomRepository.create({
      ...roomData,
      roomType,
    });
    // Lo guarda en la DB (INSERT INTO...)
    return await this.roomRepository.save(room);
  }

  // Obtener todas las habitaciones
  async findAll() {
    // Usamos relations para que la respuesta incluya el objeto roomType completo
    return await this.roomRepository.find({ relations: ['roomType'] });
  }

  // Obtener una por ID
  async findOne(id: number) {
    const room = await this.roomRepository.findOne({
      where: { id },
      relations: ['roomType'],
    });
    if (!room) {
      throw new NotFoundException(`La habitación con ID ${id} no existe`);
    }
    return room;
  }

  // Actualizar una habitación
  async update(id: number, updateRoomDto: UpdateRoomDto) {
    const { roomTypeId, ...roomData } = updateRoomDto;
    // Primero verificamos que exista (reutilizamos findOne)
    const room = await this.findOne(id);

    if (roomTypeId) {
      const roomType = await this.roomTypeRepository.findOneBy({
        id: roomTypeId,
      });
      if (!roomType)
        throw new NotFoundException(
          `El tipo de habitación con ID ${roomTypeId} no existe.`,
        );
      room.roomType = roomType;
    }

    // Fusionamos los cambios
    this.roomRepository.merge(room, roomData);
    // Guardamos
    return await this.roomRepository.save(room);
  }

  // Eliminar una habitación
  async remove(id: number) {
    const room = await this.findOne(id);
    return await this.roomRepository.remove(room);
  }
}
