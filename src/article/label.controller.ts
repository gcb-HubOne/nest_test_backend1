import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Label } from './label.entity';
import { LabelDto } from './dto/label.dao';
import { JwtAuthGuard } from '../user/jwt-auth.guard';

@Controller('label')
export class LabelController {
  constructor(
    @InjectRepository(Label)
    private readonly labelRepository: Repository<Label>,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getLabels() {
    return await this.labelRepository.find();
  }

  @Get(':id')
  async getLabel(@Param('id') id: number) {
    const label = await this.labelRepository.findOne({ where: { id } });
    if (!label) throw new NotFoundException('Label not found');
    return label;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createLabel(@Body() dto: LabelDto) {
    const label = this.labelRepository.create(dto);
    return await this.labelRepository.save(label);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateLabel(@Param('id') id: number, @Body() dto: LabelDto) {
    const label = await this.labelRepository.findOne({ where: { id } });
    if (!label) throw new NotFoundException('Label not found');
    Object.assign(label, dto);
    return await this.labelRepository.save(label);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteLabel(@Param('id') id: number) {
    return await this.labelRepository.delete(id);
  }
} 