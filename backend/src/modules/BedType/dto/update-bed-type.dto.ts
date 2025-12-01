import { PartialType } from '@nestjs/mapped-types';
import { CreateBedTypeDto } from './create-bed-type.dto';

export class UpdateBedTypeDto extends PartialType(CreateBedTypeDto) {}
