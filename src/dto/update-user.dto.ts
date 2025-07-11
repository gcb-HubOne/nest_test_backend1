import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  newPassword: string;
}

export class UpdateNicknameDto {
  @IsString()
  @IsNotEmpty()
  nickname: string;
}

export class UpdateRegisterCodeDto {
  @IsString()
  @IsNotEmpty()
  oldCode: string;

  @IsString()
  @IsNotEmpty()
  newCode: string;
} 