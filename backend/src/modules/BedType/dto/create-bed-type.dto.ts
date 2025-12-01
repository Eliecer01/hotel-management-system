import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateBedTypeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;
}
