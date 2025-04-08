import { Controller, Get, Query } from '@nestjs/common';
import { LinesService } from './lines.service';

@Controller('lines')
export class LinesController {
  constructor(private readonly linesService: LinesService) {}

  @Get()
  async getAllLines() {
    try {
      return await this.linesService.getAllLines();
    } catch (error) {
      throw new Error('Falha ao buscar as viagens');
    }
  }

  @Get('search')
  async getLines(@Query('name') name?: string) {
    try {
      if (name) {
        const response = await this.linesService.getLinesByName(name);

        if (!response || response.length === 0) {
          throw new Error('Nenhuma linha encontrada!');
        }

        return response;
      }
      
    return this.linesService.getAllLines();
    } catch (error) {
      throw error;
    }
  }
}