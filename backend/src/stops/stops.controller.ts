import { Controller, Get, Query } from '@nestjs/common';
import { StopsService } from './stops.service';

@Controller('stops')
export class StopsController {
  constructor(private readonly stopsService: StopsService) {}

  @Get()
  async getAllStops() {
    try {
      return await this.stopsService.getAllStops();
    } catch (error) {
      throw new Error('Falha ao buscar paradas.');
    }
  }

  @Get('search')
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
  async getStopsByTrip(@Query('trip_id') tripId?: number) {
    try {
      if (tripId) {
        const response = await this.stopsService.getStopsByTripId(Number(tripId));
       
      if (!response || response.length === 0) {
          throw new Error('Nenhuma parada encontrada!');
      }

      return response;
    } else {
      throw new Error('trip_id é obrigatório');}
    } catch (error) {
      throw error;
    }
  }

  @Get('/coordinates/by-trip')
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