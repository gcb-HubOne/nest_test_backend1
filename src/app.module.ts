import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticleModule } from './article/article.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './article/article.entity';
import { Content } from './article/content.entity';
import { Label } from './article/label.entity';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';
import { Profile } from './profile/profile.entity';

@Module({ 
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ArticleModule,
    UserModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('MYSQLHOST'),
        port: +config.get<number>('MYSQLPORT',3306),
        username: config.get<string>('MYSQLUSER'),
        password: config.get<string>('MYSQLPASSWORD'),
        database: config.get<string>('MYSQLDATABASE'),
        entities: [Article, Content, Label, User, Profile],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
