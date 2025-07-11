import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import { UpdatePasswordDto, UpdateNicknameDto, UpdateRegisterCodeDto } from '../dto/update-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  register(@Body() dto: CreateUserDto) {
    return this.userService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginUserDto) {
    return this.userService.login(dto);
  }

  // 用户管理API - 需要JWT认证
  @UseGuards(JwtAuthGuard)
  @Get('users')
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('users/:id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('users/password')
  updatePassword(@Request() req, @Body() dto: UpdatePasswordDto) {
    const userId = req.user.userId;
    return this.userService.updatePassword(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('users/nickname')
  updateNickname(@Request() req, @Body() dto: UpdateNicknameDto) {
    const userId = req.user.userId;
    return this.userService.updateNickname(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('users/:id/nickname')
  updateNicknameById(@Param('id') id: string, @Body() dto: UpdateNicknameDto) {
    return this.userService.updateNickname(+id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('users/:id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('register-code')
  updateRegisterCode(@Body() dto: UpdateRegisterCodeDto) {
    return this.userService.updateRegisterCode(dto);
  }

  // 直接重置密码的路由
  @UseGuards(JwtAuthGuard)
  @Put('users/reset-password/:username')
  resetPassword(@Param('username') username: string, @Body() body: { newPassword: string }) {
    return this.userService.resetPassword(username, body.newPassword);
  }
} 