import { Controller, Get, Query } from '@nestjs/common';
import { StopsService } from './stops.service';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@ApiTags('stops')
@Controller('stops')
export class StopsController {
  constructor(private readonly stopsService: StopsService) {}

  @Get()
  @ApiOperation({ summary: 'Retorna todas as paradas' })
  @ApiResponse({ status: 200, description: 'Lista de paradas retornada com sucesso.' })
  @ApiResponse({ status: 500, description: 'Falha ao buscar paradas.' })
  async getAllStops() {
    try {
      return await this.stopsService.getAllStops();
    } catch (error) {
      throw new Error('Falha ao buscar paradas.');
    }
  }

  @Get('search')
  @ApiOperation({ summary: 'Busca paradas pelo nome (opcional)' })
  @ApiQuery({ name: 'name', required: false, description: 'Nome parcial da parada' })
  @ApiResponse({ status: 200, description: 'Paradas encontradas com sucesso.' })
  @ApiResponse({ status: 404, description: 'Nenhuma parada encontrada.' })
  async getStops(@Query('name') name?: string) {
    try {
      if (name) {
        const response = await this.stopsService.getStopsByName(name);

        if (!response || response.length === 0) {
          throw new Error('Nenhuma parada encontrada!');
        }

        return response;
      }
      
      return this.stopsService.getAllStops();
    } catch (error) {
      throw error;
    }
  }

  @Get('by-trip')
  @ApiOperation({ summary: 'Retorna paradas de uma viagem' })
  @ApiQuery({ name: 'trip_id', required: true, type: Number, description: 'ID da viagem' })
  @ApiResponse({ status: 200, description: 'Paradas da viagem retornadas com sucesso.' })
  @ApiResponse({ status: 400, description: 'trip_id é obrigatório.' })
  @ApiResponse({ status: 404, description: 'Nenhuma parada encontrada.' })
  async getStopsByTrip(@Query('trip_id') tripId?: number) {
    try {
      if (tripId) {
        const response = await this.stopsService.getStopsByTripId(Number(tripId));
       
        if (!response || response.length === 0) {
          throw new Error('Nenhuma parada encontrada!');
        }

        return response;
      } else {
        throw new Error('trip_id é obrigatório');
      }
    } catch (error) {
      throw error;
    }
  }

  @Get('/coordinates/by-trip')
  @ApiOperation({ summary: 'Retorna coordenadas das paradas de uma viagem' })
  @ApiQuery({ name: 'trip_id', required: true, type: Number, description: 'ID da viagem' })
  @ApiResponse({ status: 200, description: 'Coordenadas retornadas com sucesso.' })
  @ApiResponse({ status: 400, description: 'trip_id é obrigatório.' })
  @ApiResponse({ status: 404, description: 'Nenhuma coordenada encontrada.' })
  async getCoordinatesByTrip(@Query('trip_id') tripId?: number) {
    try {
      if (tripId) {
        const response = await this.stopsService.getCoordinatesByTripId(Number(tripId));

        if (!response || response.length === 0) {
          throw new Error('Nenhuma coordenada encontrada!');
        }
        
        return response;
      } else {
        throw new Error('trip_id é obrigatório');
      }
    } catch (error) {
      throw error;
    }
  }
}
