import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { DynamicModel } from 'src/config/prisma/dynamicInterface';


@Injectable()
export class UserRepository implements DynamicModel<User> {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any): Promise<User> {
    return this.prisma.user.create(data);
  }
  
  async findUnique(params: Prisma.UserFindUniqueArgs): Promise<User | null> {
    return this.prisma.user.findUnique(params);
  }

  async findMany(params: any): Promise<User[]> {
    return this.prisma.user.findMany(params);
  }

  async update(params: { where: any; data: any }): Promise<User> {
    return this.prisma.user.update(params);
  }

  async findFirst(where: any): Promise<User | null> {
    return this.prisma.user.findFirst({ where });
  }

  async count(where: any): Promise<number> {
    return this.prisma.user.count({ where });
  }
}
