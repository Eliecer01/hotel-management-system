import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BedType } from './entities/bed-type.entity';
import { BedTypesService } from './bed-types.service';
import { BedTypesController } from './bed-types.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BedType])],
  controllers: [BedTypesController],
  providers: [BedTypesService],
})
export class BedTypesModule {}
