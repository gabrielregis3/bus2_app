import { Controller, Get, Query } from '@nestjs/common';
import { LinesService } from './lines.service';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@ApiTags('lines')
@Controller('lines')
export class LinesController {
  constructor(private readonly linesService: LinesService) {}

  @Get()
  @ApiOperation({ summary: 'Retorna todas as linhas' })
  @ApiResponse({ status: 200, description: 'Linhas retornadas com sucesso.' })
  @ApiResponse({ status: 500, description: 'Erro ao buscar as linhas.' })
  async getAllLines() {
    try {
      return await this.linesService.getAllLines();
    } catch (error) {
      throw new Error('Falha ao buscar as linhas');
    }
  }

  @Get('search')
  @ApiOperation({ summary: 'Busca linhas pelo nome (opcional)' })
  @ApiQuery({ name: 'name', required: false, description: 'Nome parcial da linha' })
  @ApiResponse({ status: 200, description: 'Linhas encontradas com sucesso.' })
  @ApiResponse({ status: 404, description: 'Nenhuma linha encontrada.' })
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
