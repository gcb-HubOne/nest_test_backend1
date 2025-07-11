import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import { UpdatePasswordDto, UpdateNicknameDto, UpdateRegisterCodeDto } from '../dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

// 建议使用环境变量管理这些敏感信息
let REGISTER_CODE = 'gcb941015';
const JWT_SECRET = 'wttoken_yxy'; // 建议放到 .env
const JWT_EXPIRES_IN = '1d';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async register(dto: CreateUserDto) {
    if (dto.code !== REGISTER_CODE) {
      throw new BadRequestException('注册码错误');
    }
    const exist = await this.userRepository.findOne({ where: { username: dto.username } });
    if (exist) {
      throw new BadRequestException('用户名已存在');
    }
    const hash = await bcrypt.hash(dto.password, 10);
    const user = this.userRepository.create({ username: dto.username, password: hash });
    await this.userRepository.save(user);
    return { message: '注册成功' };
  }

  async login(dto: LoginUserDto) {
    const user = await this.userRepository.findOne({ where: { username: dto.username } });
    if (!user) throw new UnauthorizedException('用户名或密码错误');
    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('用户名或密码错误');
    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    return { token };
  }

  async validateUser(userId: number): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id: userId } });
  }

  /**
   * 查询所有用户信息，但不返回密码字段，保留昵称等其他字段
   * 1. 从数据库查出所有用户
   * 2. 遍历每个用户对象，去掉 password 字段
   * 3. 返回处理后的用户列表
   */
  async findAll() {
    // 查询所有用户
    const users = await this.userRepository.find();
    // 去除每个用户的 password 字段
    return users.map(user => {
      const { password, ...result } = user;
      return result;
    });
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`用户ID ${id} 不存在`);
    }
    // 不返回密码字段，但返回昵称字段
    const { password, ...result } = user;
    return result;
  }

  async updatePassword(id: number, dto: UpdatePasswordDto) {
    console.log(`尝试修改用户ID=${id}的密码`);
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      console.log(`用户ID ${id} 不存在`);
      throw new NotFoundException(`用户ID ${id} 不存在`);
    }

    console.log(`比对密码: 输入=${dto.oldPassword}, 数据库(hash)=${user.password}`);
    const isMatch = await bcrypt.compare(dto.oldPassword, user.password);
    console.log(`密码比对结果: ${isMatch ? '匹配' : '不匹配'}`);
    
    if (!isMatch) {
      throw new BadRequestException('原密码错误');
    }

    const hash = await bcrypt.hash(dto.newPassword, 10);
    console.log(`新密码hash值: ${hash}`);
    user.password = hash;
    await this.userRepository.save(user);
    console.log(`密码修改成功`);
    return { message: '密码修改成功' };
  }

  async updateNickname(id: number, dto: UpdateNicknameDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`用户ID ${id} 不存在`);
    }

    user.nickname = dto.nickname;
    await this.userRepository.save(user);
    return { message: '昵称修改成功' };
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`用户ID ${id} 不存在`);
    }
    await this.userRepository.remove(user);
    return { message: '用户删除成功' };
  }

  async updateRegisterCode(dto: UpdateRegisterCodeDto) {
    if (dto.oldCode !== REGISTER_CODE) {
      throw new BadRequestException('原注册码错误');
    }
    REGISTER_CODE = dto.newCode;
    return { message: '注册码修改成功' };
  }

  // 直接重置用户密码方法
  async resetPassword(username: string, newPassword: string) {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException(`用户 ${username} 不存在`);
    }

    const hash = await bcrypt.hash(newPassword, 10);
    user.password = hash;
    await this.userRepository.save(user);
    return { message: `用户 ${username} 密码重置成功` };
  }
} 