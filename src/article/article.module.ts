import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { Article } from './article.entity';
import { Content } from './content.entity';
import { Label } from './label.entity';
import { LabelController } from './label.controller';
import { ContentController } from './content.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Article, Content, Label])],
  controllers: [ArticleController, LabelController, ContentController],
  providers: [ArticleService],
  exports: [ArticleService],
})
export class ArticleModule {}