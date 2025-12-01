import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { RoomType } from './entities/room-type.entity';
import { CreateRoomTypeDto } from './dto/create-room-type.dto';
import { UpdateRoomTypeDto } from './dto/update-room-type.dto';
import { BedType } from 'src/modules/BedType/entities/bed-type.entity';

@Injectable()
export class RoomTypesService {
  constructor(
    @InjectRepository(RoomType)
    private readonly roomTypeRepository: Repository<RoomType>,
    @InjectRepository(BedType)
    private readonly bedTypeRepository: Repository<BedType>,
  ) {}

  async create(createRoomTypeDto: CreateRoomTypeDto): Promise<RoomType> {
    const { bedIds, ...roomTypeData } = createRoomTypeDto;

    const beds = await this.bedTypeRepository.findBy({ id: In(bedIds) });
    if (beds.length !== bedIds.length) {
      throw new BadRequestException(
        'Uno o más IDs de tipos de cama no son válidos.',
      );
    }

    const newRoomType = this.roomTypeRepository.create({
      ...roomTypeData,
      beds,
    });

    return this.roomTypeRepository.save(newRoomType);
  }

  findAll(): Promise<RoomType[]> {
    return this.roomTypeRepository.find();
  }

  async findOne(id: number): Promise<RoomType> {
    const roomType = await this.roomTypeRepository.findOneBy({ id });
    if (!roomType) {
      throw new NotFoundException(
        `El tipo de habitación con ID ${id} no existe.`,
      );
    }
    return roomType;
  }

  async update(
    id: number,
    updateRoomTypeDto: UpdateRoomTypeDto,
  ): Promise<RoomType> {
    const { bedIds, ...roomTypeData } = updateRoomTypeDto;
    const roomType = await this.findOne(id);

    if (bedIds) {
      const beds = await this.bedTypeRepository.findBy({ id: In(bedIds) });
      roomType.beds = beds;
    }

    this.roomTypeRepository.merge(roomType, roomTypeData);
    return this.roomTypeRepository.save(roomType);
  }

  async remove(id: number): Promise<RoomType> {
    const roomType = await this.findOne(id);
    return this.roomTypeRepository.remove(roomType);
  }
}
