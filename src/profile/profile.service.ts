import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './profile.entity';
import { User } from '../user/user.entity';
import { ProfileDto } from './dto/profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getProfile(userId: number) {
    const profile = await this.profileRepository.findOne({ where: { id: userId } });
    if (!profile) throw new NotFoundException('未找到个人介绍');
    return profile;
  }

  async getDefaultProfile() {
    // 查询第一个个人资料作为默认个人介绍
    const profiles = await this.profileRepository.find({
      take: 1,
      order: { id: 'ASC' },
    });

    if (profiles.length === 0) {
      // 如果没有个人资料，返回默认信息
      return {
        nickname: '网站管理员',
        avatar: '',
        introduction: '这是默认个人介绍',
        github: '',
        email: '',
      };
    }

    return profiles[0];
  }

  async createOrUpdateProfile(userId: number, dto: ProfileDto) {
    let profile = await this.profileRepository.findOne({ where: { id: userId } });
    if (!profile) {
      profile = this.profileRepository.create({ ...dto, id: userId });
    } else {
      Object.assign(profile, dto);
    }
    return await this.profileRepository.save(profile);
  }

  async deleteProfile(userId: number) {
    const profile = await this.profileRepository.findOne({ where: { id: userId } });
    if (!profile) throw new NotFoundException('未找到个人介绍');
    return await this.profileRepository.delete(profile.id);
  }
} 