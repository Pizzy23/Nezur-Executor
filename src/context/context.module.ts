import { Module } from '@nestjs/common';
import { TransactionController, UsersController } from './controller';
import { TransactionService, UserService } from './service';
import { EntityModule } from './entity/entity.module';

@Module({
  imports: [EntityModule],
  controllers: [UsersController,TransactionController],
  providers: [UserService,TransactionService],
  exports:[UserService],
})
export class ContextModule {}
