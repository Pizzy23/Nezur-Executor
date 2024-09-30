import { TransactionRepository } from 'src/context/entity';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserRepository } from 'src/context/entity';
import { CreateTransferDto, UpdateTransferDto } from 'src/view/dto';
import { Historic, User } from '@prisma/client';
import { StatusEnum } from 'src/view/enums';

@Injectable()
export class TransactionService {
  constructor(
    private repository: TransactionRepository,
    private userRepository: UserRepository,
  ) {}

  async transferCurrent(createTransferDto: CreateTransferDto): Promise<string> {
    try {
      const existingSender = await this.userRepository.findUnique({
        where: { email: createTransferDto.sender },
      });
      const existingReceiver = await this.userRepository.findUnique({
        where: { email: createTransferDto.received },
      });

      this.validCurrent(existingSender, existingReceiver, createTransferDto);

      const data = {
        sender: existingSender.id,
        receiver: existingReceiver.id,
        value: createTransferDto.current,
        status: StatusEnum.ANALYSE,
      };

      await this.repository.create({ data });

      return 'Transação concluída, aguarde a nossa análise para liberação do saldo.';
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Erro ao realizar a transferência.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateTransfer(
    id: string,
    updateTransferDto: UpdateTransferDto,
  ): Promise<string> {
    try {
      const transfer = await this.repository.findUnique({
        where: { id: parseInt(id) },
      });
      const existingSender = await this.userRepository.findUnique({
        where: { id: transfer.sender },
      });
      const existingReceiver = await this.userRepository.findUnique({
        where: { id: transfer.receiver },
      });

      if (!existingSender || !existingReceiver) {
        throw new HttpException('Usuário inválido.', HttpStatus.BAD_REQUEST);
      }

      switch (updateTransferDto.status) {
        case StatusEnum.INVALID:
          return 'Sua transação é inválida, por favor, entre em contato com o suporte.';

        case StatusEnum.REFUND:
          await this.userRepository.update({
            where: { id: existingSender.id },
            data: {
              current: existingSender.current + transfer.value,
            },
          });

          await this.userRepository.update({
            where: { id: existingReceiver.id },
            data: {
              current: existingReceiver.current - transfer.value,
            },
          });
          return 'Sua transação foi negada.';

        case StatusEnum.VALID:
          await this.userRepository.update({
            where: { id: existingSender.id },
            data: {
              current: existingSender.current - transfer.value,
            },
          });

          await this.userRepository.update({
            where: { id: existingReceiver.id },
            data: {
              current: existingReceiver.current + transfer.value,
            },
          });

          return 'Sua transação foi autorizada :)';

        default:
          throw new HttpException(
            'Status de transação inválido.',
            HttpStatus.BAD_REQUEST,
          );
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Erro ao atualizar a transferência.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private validCurrent(
    existingSender: User,
    existingReceiver: User,
    transfer: CreateTransferDto,
  ): void {
    if (!existingSender || !existingReceiver) {
      throw new HttpException('Usuário inválido.', HttpStatus.BAD_REQUEST);
    }
    if (existingSender.current < transfer.current) {
      throw new HttpException('Saldo insuficiente.', HttpStatus.BAD_REQUEST);
    }
    if (transfer.current <= 0) {
      throw new HttpException(
        'O valor deve ser maior que zero.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async getAllTransfer(): Promise<Historic[]> {
    return await this.repository.findMany({});
  }
}
