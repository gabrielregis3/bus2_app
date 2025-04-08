import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StopsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllStops() {
    return this.prisma.stop.findMany();
  }

  async getStopsByName(name: string) {
    return this.prisma.stop.findMany({
      where: {
        stop_name: {
          contains: name,
        },
      },
    });
  }
  
  async getStopsByTripId(tripId: number) {
    return this.prisma.stop.findMany({
      where: {
        trip_id: {
          equals: tripId
        },
      },
    });
  }

async getCoordinatesByTripId(tripId: number) {
  return this.prisma.stop.findMany({
    where: { trip_id: tripId },
    orderBy: { sequence: 'asc' },
    select: {
      latitude: true,
      longitude: true,
    }
    });
  }
}