import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Profile } from '../profile/profile.entity';
import { UserService } from './user.service';
import { ProfileService } from '../profile/profile.service';
import { UserController } from './user.controller';
import { ProfileController } from '../profile/profile.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile])],
  providers: [UserService, ProfileService],
  controllers: [UserController, ProfileController],
  exports: [UserService, ProfileService],
})
export class UserModule {} 