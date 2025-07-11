import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dao';
import { JwtAuthGuard } from '../user/jwt-auth.guard';

@Controller('article')
export class ArticleController {

    constructor(private readonly articleService: ArticleService) { }

    // 获取所有文章，支持分页和模糊查询，公开接口
    @Get()
    getArticles(
        @Query('page') page?: number,
        @Query('pageSize') pageSize?: number,
        @Query('title') title?: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
        @Query('label') label?: string
    ) {
        return this.articleService.getArticles({ page, pageSize, title, startDate, endDate, label });
    }

    // 获取单个文章，公开接口
    @Get(':id')
    getArticle(@Param('id') id: number) {
        return this.articleService.getArticle(Number(id));
    }

    // 创建文章，需要认证
    @UseGuards(JwtAuthGuard)
    @Post()
    createArticle(@Body() dto: CreateArticleDto) {
        return this.articleService.createArticle(dto);
    }

    // 更新文章，需要认证
    @UseGuards(JwtAuthGuard)
    @Put(':id')
    updateArticle(@Param('id') id: number, @Body() dto: CreateArticleDto) {
        return this.articleService.updateArticle(Number(id), dto);
    }

    // 删除文章，需要认证
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    deleteArticle(@Param('id') id: number) {
        return this.articleService.deleteArticle(Number(id));
    }
}
