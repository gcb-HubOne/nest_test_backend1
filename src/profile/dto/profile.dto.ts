import { IsOptional, IsString, IsNotEmpty, IsEmail, IsNumber } from 'class-validator';

export class ProfileDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  weixin: string;

  @IsString()
  @IsNotEmpty()
  desc_per: string;

  @IsString()
  @IsNotEmpty()
  work_exhibition: string; // 可存图片URL+描述，前端可用分隔符拼接
} 