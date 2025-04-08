import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LinesService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllLines() {
    return this.prisma.line.findMany();
  }

  async getLinesByName(name: string) {
    return this.prisma.line.findMany({
      where: {
        name: {
          contains: name,
        },
      },
    });
  }
}