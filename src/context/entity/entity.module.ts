import { Module } from '@nestjs/common';
import { PrismaService } from 'src/config';
import DynamicPrisma from 'src/config/prisma/dynamicPrisma';
import { UserRepository } from './user/user.entity';
import { TransactionRepository } from './transaction/transaction.entity';

@Module({
  exports: [
    PrismaService,
    DynamicPrisma,
    UserRepository,
    TransactionRepository,
  ],
  providers: [
    PrismaService,
    DynamicPrisma,
    UserRepository,
    TransactionRepository,
  ],
})
export class EntityModule {}
