import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BedType } from './entities/bed-type.entity';
import { CreateBedTypeDto } from './dto/create-bed-type.dto';
import { UpdateBedTypeDto } from './dto/update-bed-type.dto';

@Injectable()
export class BedTypesService {
  constructor(
    @InjectRepository(BedType)
    private readonly bedTypeRepository: Repository<BedType>,
  ) {}

  async create(createBedTypeDto: CreateBedTypeDto): Promise<BedType> {
    const bedType = this.bedTypeRepository.create(createBedTypeDto);
    return this.bedTypeRepository.save(bedType);
  }

  async findAll(): Promise<BedType[]> {
    return this.bedTypeRepository.find();
  }

  async findOne(id: number): Promise<BedType> {
    const bedType = await this.bedTypeRepository.findOneBy({ id });
    if (!bedType) {
      throw new NotFoundException(`El tipo de cama con ID ${id} no existe.`);
    }
    return bedType;
  }

  async update(
    id: number,
    updateBedTypeDto: UpdateBedTypeDto,
  ): Promise<BedType> {
    const bedType = await this.findOne(id);
    this.bedTypeRepository.merge(bedType, updateBedTypeDto);
    return this.bedTypeRepository.save(bedType);
  }

  async remove(id: number): Promise<BedType> {
    const bedType = await this.findOne(id);
    return this.bedTypeRepository.remove(bedType);
  }
}
