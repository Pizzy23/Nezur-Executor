
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../config';

@Injectable()
export class HistoryEntity {
  constructor(private prisma: PrismaService) {}
  async History(input) {
    await this.prisma.user.create({
      data: input,
    });
  }
}