import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LinesModule } from './lines/lines.module';
import { StopsModule } from './stops/stops.module';
import { TripsModule } from './trips/trips.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    LinesModule,
    StopsModule,
    TripsModule,
  ],
})

export class AppModule {}