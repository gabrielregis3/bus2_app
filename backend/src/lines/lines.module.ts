import { Module } from '@nestjs/common';
import { LinesService } from './lines.service';
import { LinesController } from './lines.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [LinesController],
  providers: [LinesService, PrismaService],
})
export class LinesModule {}
