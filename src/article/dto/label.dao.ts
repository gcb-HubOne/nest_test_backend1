import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class LabelDto {
  @IsOptional()
  id?: number;

  @IsString()
  @IsNotEmpty()
  name: string;
} 