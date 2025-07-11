import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dao';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Article } from './article.entity';
import { DeleteResult } from 'typeorm';
import { Content } from './content.entity';
import { Label } from './label.entity';

function formatDate(date: Date | string | undefined): string | undefined {
    if (!date) return undefined;
    const d = new Date(date);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

@Injectable()
export class ArticleService {
    constructor(
        @InjectRepository(Article)
        private readonly articleRepository: Repository<Article>,
        @InjectRepository(Content)
        private readonly contentRepository: Repository<Content>,
        @InjectRepository(Label)
        private readonly labelRepository: Repository<Label>,
    ){}

    async getArticles(query: {
        page?: number;
        pageSize?: number;
        title?: string;
        startDate?: string;
        endDate?: string;
        label?: string;
    }): Promise<{ data: any[]; total: number }> {
        const qb = this.articleRepository.createQueryBuilder('article')
            .leftJoinAndSelect('article.label', 'label')
            .leftJoinAndSelect('article.content', 'content');
        if (query.title) {
            qb.andWhere('article.title LIKE :title', { title: `%${query.title}%` });
        }
        if (query.startDate) {
            qb.andWhere('article.createTime >= :startDate', { startDate: query.startDate });
        }
        if (query.endDate) {
            qb.andWhere('article.createTime <= :endDate', { endDate: query.endDate });
        }
        if (query.label) {
            qb.andWhere('label.name = :label', { label: query.label });
        }
        const page = Number(query.page) || 1;
        const pageSize = Number(query.pageSize) || 10;
        qb.skip((page - 1) * pageSize).take(pageSize);
        const [data, total] = await qb.getManyAndCount();
        // 格式化时间字段
        const format = (item: any) => ({
            ...item,
            createTime: formatDate(item.createTime),
            updateTime: formatDate(item.updateTime),
            label: item.label ? {
                ...item.label,
                createAt: formatDate(item.label.createAt),
                updateAt: formatDate(item.label.updateAt),
            } : undefined,
        });
        return { data: data.map(format), total };
    }

    async getArticle(id: number): Promise<any> {
        const article = await this.articleRepository.findOne({ where: { id }, relations: ['label', 'content'] });
        if (!article) {
            throw new NotFoundException('Article not found');
        }
        return {
            ...article,
            createTime: formatDate(article.createTime),
            updateTime: formatDate(article.updateTime),
            label: article.label ? {
                ...article.label,
                createAt: formatDate(article.label.createAt),
                updateAt: formatDate(article.label.updateAt),
            } : undefined,
        };
    }

    async createArticle(dto: CreateArticleDto): Promise<Article> {
        try {
            // 验证标题
            if (!dto.title || dto.title.trim() === '') {
                throw new BadRequestException('文章标题不能为空');
            }

            // 处理 content
            let content: Content | undefined;
            if (dto.content) {
                // 确保table字段是有效的JSON
                if (dto.content.table) {
                    try {
                        if (typeof dto.content.table === 'string') {
                            dto.content.table = JSON.parse(dto.content.table);
                        }
                    } catch (e) {
                        throw new BadRequestException('表格数据格式无效');
                    }
                }
                
                content = this.contentRepository.create(dto.content);
                try {
                    content = await this.contentRepository.save(content);
                } catch (error) {
                    console.error('创建内容失败:', error);
                    throw new BadRequestException('创建内容失败: ' + error.message);
                }
            }
            
            // 处理 label
            let label: Label | null = null;
            if (dto.label && dto.label.name) {
                try {
                    label = await this.labelRepository.findOne({ where: { name: dto.label.name } });
                    if (!label) {
                        label = this.labelRepository.create(dto.label);
                        label = await this.labelRepository.save(label);
                    }
                } catch (error) {
                    console.error('处理标签失败:', error);
                    // 如果是唯一约束错误
                    if (error.code === 'ER_DUP_ENTRY') {
                        throw new BadRequestException('标签名称已存在');
                    }
                    throw new BadRequestException('处理标签失败: ' + error.message);
                }
            }
            
            // 创建 article
            const article = this.articleRepository.create({
                title: dto.title,
                content,
                label: label ?? undefined,
            });
            
            return await this.articleRepository.save(article);
        } catch (error) {
            console.error('创建文章失败:', error);
            
            // 如果已经是HTTP异常，则直接抛出
            if (error.status) {
                throw error;
            }
            
            // 其他未知错误
            throw new InternalServerErrorException('创建文章失败: ' + error.message);
        }
    }

    async updateArticle(id: number, dto: CreateArticleDto): Promise<Article> {
    // 处理 content
    let content: Content | undefined;
    if (dto.content) {
        content = this.contentRepository.create(dto.content);
        content = await this.contentRepository.save(content);
    }
    // 处理 label
    let label: Label | null = null;
    if (dto.label && dto.label.name) {
        label = await this.labelRepository.findOne({ where: { name: dto.label.name } });
        if (!label) {
            label = this.labelRepository.create(dto.label);
            label = await this.labelRepository.save(label);
        }
    }
    // 查找原有 article
    const article = await this.articleRepository.findOne({ where: { id } });
    if (!article) throw new NotFoundException('Article not found');
    // 更新字段
    article.title = dto.title;
    if (content) article.content = content;
    if (label) article.label = label;
    // 保存
    return await this.articleRepository.save(article);
}

    async deleteArticle(id: number): Promise<DeleteResult> {
        return await this.articleRepository.delete(id);
    }

}
