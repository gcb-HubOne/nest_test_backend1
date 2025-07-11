import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Content } from './content.entity';
import { ContentDto } from './dto/content.dao';
import { JwtAuthGuard } from '../user/jwt-auth.guard';

@Controller('content')
export class ContentController {
  constructor(
    @InjectRepository(Content)
    private readonly contentRepository: Repository<Content>,
  ) {}

  @Get()
  async getContents() {
    return await this.contentRepository.find();
  }

  @Get(':id')
  async getContent(@Param('id') id: number) {
    const content = await this.contentRepository.findOne({ where: { id } });
    if (!content) throw new NotFoundException('Content not found');
    return content;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createContent(@Body() dto: ContentDto) {
    const content = this.contentRepository.create(dto);
    return await this.contentRepository.save(content);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateContent(@Param('id') id: number, @Body() dto: ContentDto) {
    const content = await this.contentRepository.findOne({ where: { id } });
    if (!content) throw new NotFoundException('Content not found');
    Object.assign(content, dto);
    return await this.contentRepository.save(content);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteContent(@Param('id') id: number) {
    return await this.contentRepository.delete(id);
  }
} 