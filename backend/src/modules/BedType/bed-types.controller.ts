import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { BedTypesService } from './bed-types.service';
import { CreateBedTypeDto } from './dto/create-bed-type.dto';
import { UpdateBedTypeDto } from './dto/update-bed-type.dto';

@Controller('bed-types')
export class BedTypesController {
  constructor(private readonly bedTypesService: BedTypesService) {}

  @Post()
  create(@Body() createBedTypeDto: CreateBedTypeDto) {
    return this.bedTypesService.create(createBedTypeDto);
  }

  @Get()
  findAll() {
    return this.bedTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bedTypesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBedTypeDto: UpdateBedTypeDto,
  ) {
    return this.bedTypesService.update(id, updateBedTypeDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bedTypesService.remove(id);
  }
}
