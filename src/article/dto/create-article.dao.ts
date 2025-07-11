import { IsString, IsNotEmpty, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { ContentDto } from './content.dao';
import { LabelDto } from './label.dao';

export class CreateArticleDto {
  @IsOptional()
  readonly id?: number;

  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @ValidateNested()
  @Type(() => ContentDto)
  @IsOptional()
  readonly content?: ContentDto;

  @ValidateNested()
  @Type(() => LabelDto)
  @IsOptional()
  readonly label?: LabelDto;
}


