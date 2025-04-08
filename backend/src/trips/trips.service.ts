import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TripsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllTrips() {
    return this.prisma.trip.findMany();
  }

  async getTripByName(name: string) {
    return this.prisma.trip.findMany({
      where: {
        name: {
          contains: name,
        },
      },
    });
  }

  async getTripsByStopName(stopName: string) {
    return this.prisma.trip.findMany({
      where: {
        stops: {
          some: {
            stop_name: {
              contains: stopName
            },
          },
        },
      },
      include: {
        stops: true,
      },
    });
  }

  async getTripsByStopId(stopId: number): Promise<any[]> {
    return this.prisma.trip.findMany({
      where: {
        stops: {
          some: {
            stop_id: stopId
          }
        }
      },
      include: {
        line: true
      }
    });
  }

  async getTripsAndPathByName(tripName: string) {
    return this.prisma.trip.findFirst({
      where: {
        name: {
          contains: tripName,
        },
      },
      include: {
        stops: {
          orderBy: {
            sequence: 'asc',
          },
        },
      },
    });
  }
  
  async getTripsByLineId(lineId: number) {
    return this.prisma.trip.findMany({
      where: {
          line_id: {
            equals: lineId
          },
        },
    });
  }
}