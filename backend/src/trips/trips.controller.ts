import { Controller, Get, Query } from '@nestjs/common';
import { TripsService } from './trips.service';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@ApiTags('trips')
@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Get()
  @ApiOperation({ summary: 'Retorna todas as viagens' })
  @ApiResponse({ status: 200, description: 'Viagens retornadas com sucesso.' })
  @ApiResponse({ status: 500, description: 'Erro ao buscar viagens.' })
  async getAllTrips() {
    try {
      return await this.tripsService.getAllTrips();
    } catch (error) {
      throw new Error('Falha ao buscar viagens.');
    }
  }

  @Get('search')
  @ApiOperation({ summary: 'Busca viagens por nome (opcional)' })
  @ApiQuery({ name: 'name', required: false, description: 'Nome da viagem' })
  @ApiResponse({ status: 200, description: 'Viagens encontradas com sucesso.' })
  @ApiResponse({ status: 404, description: 'Nenhuma viagem encontrada.' })
  async getTrips(@Query('name') name?: string) {
    try {
      if (name) {
        const response = await this.tripsService.getTripByName(name);
        if (!response || response.length === 0) {
          throw new Error('Nenhuma viagem encontrada!');
        }
        return response;
      }

      return this.tripsService.getAllTrips();
    } catch (error) {
      throw error;
    }
  }

  @Get('by-stop')
  @ApiOperation({ summary: 'Busca viagens pelo nome da parada' })
  @ApiQuery({ name: 'name', required: true, description: 'Nome da parada' })
  @ApiResponse({ status: 200, description: 'Viagens encontradas com sucesso.' })
  @ApiResponse({ status: 404, description: 'Nenhuma viagem encontrada.' })
  async getTripsByStop(@Query('name') name: string) {
    try {
      if (name) {
        const response = await this.tripsService.getTripsByStopName(name);

        if (!response || response.length === 0) {
          throw new Error('Nenhuma viagem encontrada!');
        }

        return response;
      }

      return this.tripsService.getAllTrips();
    } catch (error) {
      throw error;
    }
  }

  @Get('by-stop-id')
  @ApiOperation({ summary: 'Busca viagens pelo ID da parada' })
  @ApiQuery({ name: 'stop_id', required: true, description: 'ID da parada' })
  @ApiResponse({ status: 200, description: 'Viagens encontradas com sucesso.' })
  @ApiResponse({ status: 400, description: 'stop_id é obrigatório.' })
  async getTripsByStopId(@Query('stop_id') stopId?: number) {
    try {
      if (stopId) {
        const response = await this.tripsService.getTripsByStopId(Number(stopId));

        if (!response || response.length === 0) {
          throw new Error('Nenhuma viagem encontrada!');
        }

        return response;
      } else {
        throw new Error('stop_id é obrigatório');
      }
    } catch (error) {
      throw error;
    }
  }

  @Get('by-name')
  @ApiOperation({ summary: 'Retorna viagem e caminho por nome da viagem' })
  @ApiQuery({ name: 'name', required: true, description: 'Nome da viagem' })
  @ApiResponse({ status: 200, description: 'Viagem encontrada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Nenhuma viagem encontrada.' })
  async getTripsAndPath(@Query('name') name: string) {
    try {
      if (name) {
        const response = await this.tripsService.getTripsAndPathByName(name);

        if (!response) {
          throw new Error('Nenhuma viagem encontrada!');
        }

        return response;
      }
    } catch (error) {
      throw error;
    }
  }

  @Get('by-line')
  @ApiOperation({ summary: 'Busca viagens por ID da linha' })
  @ApiQuery({ name: 'line_id', required: true, description: 'ID da linha' })
  @ApiResponse({ status: 200, description: 'Viagens encontradas com sucesso.' })
  @ApiResponse({ status: 400, description: 'trip_id é obrigatório.' })
  async getTripsByLine(@Query('line_id') lineId?: string) {
    try {
      if (lineId) {
        const response = await this.tripsService.getTripsByLineId(Number(lineId));

        if (!response || response.length === 0) {
          throw new Error('Nenhuma viagem encontrada!');
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
