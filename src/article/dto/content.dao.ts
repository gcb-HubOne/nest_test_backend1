import { IsOptional, IsString, IsArray, ValidateIf } from 'class-validator';
import { Transform } from 'class-transformer';

export class ContentDto {
  @IsOptional()
  id?: number;

  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @Transform(({ value }) => {
    // 如果是字符串，尝试解析成JSON
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch (e) {
        return value; // 保持原样，让验证器处理错误
      }
    }
    return value;
  })
  @ValidateIf((o) => o.table !== undefined && o.table !== null)
  table?: any;

  @IsOptional()
  @IsString()
  file?: string;
} 