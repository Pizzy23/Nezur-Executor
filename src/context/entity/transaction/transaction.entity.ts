import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { Historic, Prisma } from '@prisma/client';
import { DynamicModel } from 'src/config/prisma/dynamicInterface';

@Injectable()
export class TransactionRepository implements DynamicModel<Historic> {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.HistoricCreateArgs): Promise<Historic> {
    return this.prisma.historic.create(data);
  }

  async findUnique(
    params: Prisma.HistoricFindUniqueArgs,
  ): Promise<Historic | null> {
    return this.prisma.historic.findUnique(params);
  }

  async findMany(params: Prisma.HistoricFindManyArgs): Promise<Historic[]> {
    return this.prisma.historic.findMany(params);
  }

  async update(params: Prisma.HistoricUpdateArgs): Promise<Historic> {
    return this.prisma.historic.update(params);
  }
}
