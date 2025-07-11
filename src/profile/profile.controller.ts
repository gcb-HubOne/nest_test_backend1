import { Controller, Get, Post, Put, Delete, Body, Req, UseGuards, Param } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileDto } from './dto/profile.dto';
import { JwtAuthGuard } from '../user/jwt-auth.guard';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  // 根据ID获取个人资料，公开接口
  @Get(':id')
  getProfileById(@Param('id') id: number) {
    return this.profileService.getProfile(Number(id));
  }

  // 获取个人介绍，公开接口
  @Get()
  getProfile() {
    // 获取默认个人介绍或第一个个人资料
    return this.profileService.getDefaultProfile();
  }

  // 获取当前登录用户的个人资料，需要认证
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMyProfile(@Req() req) {
    return this.profileService.getProfile(req.user.userId);
  }

  // 创建或更新个人资料，需要认证
  @UseGuards(JwtAuthGuard)
  @Post()
  createOrUpdateProfile(@Req() req, @Body() dto: ProfileDto) {
    return this.profileService.createOrUpdateProfile(req.user.userId, dto);
  }

  // 更新个人资料，需要认证
  @UseGuards(JwtAuthGuard)
  @Put()
  updateProfile(@Req() req, @Body() dto: ProfileDto) {
    return this.profileService.createOrUpdateProfile(req.user.userId, dto);
  }

  // 删除个人资料，需要认证
  @UseGuards(JwtAuthGuard)
  @Delete()
  deleteProfile(@Req() req) {
    return this.profileService.deleteProfile(req.user.userId);
  }
} 