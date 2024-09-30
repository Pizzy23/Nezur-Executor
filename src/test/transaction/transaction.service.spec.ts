import { Test, TestingModule } from '@nestjs/testing';
import { TransactionRepository, UserRepository } from 'src/context/entity';
import { TransactionService } from 'src/context/service';
import { CreateTransferDto, UpdateTransferDto } from 'src/view/dto';
import { User, Historic } from '@prisma/client';
import { HttpException, HttpStatus } from '@nestjs/common';
import { StatusEnum } from 'src/view/enums';

const mockTransactionRepository = () => ({
  findUnique: jest.fn(),
  create: jest.fn(),
  findMany: jest.fn(),
  update: jest.fn(),
});

const mockUserRepository = () => ({
  findUnique: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
});

describe('TransactionService', () => {
  let service: TransactionService;
  let transactionRepository: ReturnType<typeof mockTransactionRepository>;
  let userRepository: ReturnType<typeof mockUserRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        { provide: TransactionRepository, useFactory: mockTransactionRepository },
        { provide: UserRepository, useFactory: mockUserRepository },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    transactionRepository = module.get(TransactionRepository);
    userRepository = module.get(UserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });


  describe('transferCurrent', () => {
    it('deve realizar uma transferência com sucesso', async () => {
      const createTransferDto: CreateTransferDto = {
        sender: 'sender@example.com',
        received: 'receiver@example.com',
        current: 50,
        status: StatusEnum.ANALYSE,
      };

      const sender: User = {
        id: 1,
        email: 'sender@example.com',
        current: 100,
        password: 'hashedPassword',
      };

      const receiver: User = {
        id: 2,
        email: 'receiver@example.com',
        current: 100,
        password: 'hashedPassword',
      };

      userRepository.findUnique
        .mockResolvedValueOnce(sender)
        .mockResolvedValueOnce(receiver);

      transactionRepository.create.mockResolvedValue({
        id: 1,
        sender: sender.id,
        receiver: receiver.id,
        value: createTransferDto.current,
        status: StatusEnum.ANALYSE,
      } as Historic);

      const result = await service.transferCurrent(createTransferDto);

      expect(userRepository.findUnique).toHaveBeenCalledWith({
        where: { email: createTransferDto.sender },
      });

      expect(userRepository.findUnique).toHaveBeenCalledWith({
        where: { email: createTransferDto.received },
      });

      expect(transactionRepository.create).toHaveBeenCalledWith({
        data: {
          sender: sender.id,
          receiver: receiver.id,
          value: createTransferDto.current,
          status: StatusEnum.ANALYSE,
        },
      });

      expect(result).toBe(
        'Transação concluída, aguarde a nossa análise para liberação do saldo.',
      );
    });
  });

  describe('updateTransfer', () => {
    it('deve atualizar a transferência para status VALID', async () => {
      const updateTransferDto: UpdateTransferDto = {
        status: StatusEnum.VALID,
      };

      const transfer = {
        id: 1,
        sender: 1,
        receiver: 2,
        value: 50,
        status: StatusEnum.VALID,
      } as Historic;

      const sender: User = {
        id: 1,
        email: 'sender@example.com',
        password: '',
        current: 100,
      };

      const receiver: User = {
        id: 2,
        email: 'receiver@example.com',
        password: '',
        current: 50,
      };

      transactionRepository.findUnique.mockResolvedValue(transfer);
      userRepository.findUnique
        .mockResolvedValueOnce(sender)
        .mockResolvedValueOnce(receiver);

      const result = await service.updateTransfer('1', updateTransferDto);

      expect(transactionRepository.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });

      expect(userRepository.update).toHaveBeenNthCalledWith(1, {
        where: { id: sender.id },
        data: { current: sender.current - transfer.value },
      });

      expect(userRepository.update).toHaveBeenNthCalledWith(2, {
        where: { id: receiver.id },
        data: { current: receiver.current + transfer.value },
      });

      expect(result).toBe('Sua transação foi autorizada :)');
    });
  });

  describe('getAllTransfer', () => {
    it('deve retornar todas as transferências', async () => {
      const transfers: Historic[] = [
        {
          id: 1,
          sender: 1,
          receiver: 2,
          value: 50,
          status: StatusEnum.ANALYSE,
        },
        {
          id: 2,
          sender: 3,
          receiver: 4,
          value: 100,
          status: StatusEnum.VALID,
        },
      ];

      transactionRepository.findMany.mockResolvedValue(transfers);

      const result = await service.getAllTransfer();

      expect(transactionRepository.findMany).toHaveBeenCalledWith({});
      expect(result).toEqual(transfers);
    });
  });
});
