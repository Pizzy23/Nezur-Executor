import { PrismaClient, Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { DynamicModel } from './dynamicInterface';

type DynamicPrismaModels = {
  [key: string]: any; // Ajustado para aceitar qualquer modelo
};

@Injectable()
class DynamicPrisma {
  private readonly models: DynamicPrismaModels;

  constructor(private readonly prisma: PrismaService) {
    this.models = this.createModels(prisma);
  }

  private createModels(prisma: PrismaService): DynamicPrismaModels {
    const models: DynamicPrismaModels = {};

    models['User'] = prisma.user;
    models['Historic'] = prisma.historic;

    return models;
  }

  async create<T>(modelName: string, data: any): Promise<T> {
    const model = this.models[modelName];

    if (!model) {
      throw new Error(`Model '${modelName}' not found.`);
    }

    return await model.create({ data });
  }

  async findById<T>(modelName: string, where: any): Promise<T | null> {
    const model = this.models[modelName];

    if (!model) {
      throw new Error(`Model '${modelName}' not found.`);
    }

    return await model.findUnique({ where });
  }

  async findByEmail<T>(modelName: string, where: any): Promise<T | null> {
    const model = this.models[modelName];

    if (!model) {
      throw new Error(`Model '${modelName}' not found.`);
    }

    return await model.findUnique({ where });
  }

  async findMany<T>(modelName: string, data: any): Promise<T[]> {
    const model = this.models[modelName];

    if (!model) {
      throw new Error(`Model '${modelName}' not found.`);
    }

    return await model.findMany({
      where: data,
      take: 20,
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async findManyPages<T>(modelName: string, data: any, page: number): Promise<T[]> {
    const model = this.models[modelName];

    if (!model) {
      throw new Error(`Model '${modelName}' not found.`);
    }

    return await model.findMany({
      where: data,
      take: 20,
      skip: (page - 1) * 20,
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async update<T>(modelName: string, where: any, data: any): Promise<T> {
    const model = this.models[modelName];

    if (!model) {
      throw new Error(`Model '${modelName}' not found.`);
    }

    return await model.update({ where, data });
  }

  async count(modelName: string, data: any): Promise<number> {
    const model = this.models[modelName];

    if (!model) {
      throw new Error(`Model '${modelName}' not found.`);
    }

    return await model.count({ where: data });
  }

  async findFirst<T>(modelName: string, data: any): Promise<T | null> {
    const model = this.models[modelName];

    if (!model) {
      throw new Error(`Model '${modelName}' not found.`);
    }

    return await model.findFirst({ where: data });
  }
}

export default DynamicPrisma;
