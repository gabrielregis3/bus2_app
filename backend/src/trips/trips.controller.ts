import { Controller, Get, Query } from '@nestjs/common';
import { TripsService } from './trips.service';

@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Get()
  async getAllTrips() {
    try {
      return await this.tripsService.getAllTrips();
    } catch (error) {
      throw new Error('Falha ao buscar viagens.');
    }
  }

  @Get('search')
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
  async getTripsByStopId(@Query('stop_id') stopId: number) {
    return this.tripsService.getTripsByStopId(Number(stopId));
  }

  @Get('by-name')
  async getTripsAndPath(@Query('name') name: string) {
    try {
      if (name) {
        const response = await this.tripsService.getTripsAndPathByName(name);
        
        if (!response) {
          throw new Error('Nenhuma viagem encontrada!');
        }  
        
        return response;
      }
      
    }
    catch (error) {
      throw new Error('Digite o nome da viagem!.');
    }
  }

  @Get('by-line')
  async getTripsByLine(@Query('line_id') lineId?: string) {
    try {
      if (lineId) {
        const response = await this.tripsService.getTripsByLineId(Number(lineId));
        
        if (!response || response.length === 0) {
          throw new Error('Nenhuma viagem encontrada!');
      }
      
        return response
      } else {
        throw new Error('trip_id é obrigatório');
      }
      } catch (error) { 
        throw error;
      }
  }
}