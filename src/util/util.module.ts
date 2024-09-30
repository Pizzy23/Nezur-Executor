import { Module } from '@nestjs/common';
import { CpfVeri } from './cpf';
import { DateManipulator } from './date';

@Module({
  exports: [CpfVeri, DateManipulator],
  providers: [CpfVeri, DateManipulator],
})
export class UtilModule {}
