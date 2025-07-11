import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = 'wttoken_yxy';// 建议放到 .env
const IS_DEV_MODE = true; // 开发环境标志

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const auth = request.headers['authorization'];
    if (!auth || !auth.startsWith('Bearer ')) {
      throw new UnauthorizedException('未登录或token无效');
    }
    const token = auth.replace('Bearer ', '');
    try {
      // 尝试验证token
      const payload = jwt.verify(token, JWT_SECRET);
      request.user = payload;
      return true;
    } catch (error) {
      // 开发环境下，如果token验证失败，使用固定的测试用户信息
      if (IS_DEV_MODE) {
        console.warn('开发环境: JWT验证失败，使用测试用户身份');
        request.user = { 
          userId: 1, 
          username: 'testuser' 
        };
        return true;
      }
      throw new UnauthorizedException('token无效或已过期');
    }
  }
} 