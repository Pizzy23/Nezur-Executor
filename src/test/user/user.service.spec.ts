import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from 'src/context/entity';
import { CreateUserDto, UpdateUserDto } from 'src/view/dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/context/service';

describe('UserService', () => {
  let service: UserService;
  let repository: jest.Mocked<UserRepository>;

  beforeEach(async () => {
    const mockRepository = {
      findUnique: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRepository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get(UserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve criar um novo usuário com sucesso', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        current: 0,
      };

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      const user = {
        id: 1,
        email: createUserDto.email,
        password: hashedPassword,
        current: 0,
      };

      repository.findUnique.mockResolvedValue(null);
      repository.create.mockResolvedValue(user);

      const result = await service.create(createUserDto);

      expect(repository.findUnique).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });

      expect(repository.create).toHaveBeenCalledWith({
        data: {
          ...createUserDto,
          password: expect.any(String),
          current: 0,
        },
      });

      expect(result).toEqual({
        id: user.id,
        email: user.email,
        current: user.current,
        password: user.password,
      });
    });

    it('deve lançar uma exceção quando o email já está em uso', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        current: 0,
      };

      repository.findUnique.mockResolvedValue({ id: 1, ...createUserDto });

      await expect(service.create(createUserDto)).rejects.toThrow(
        new HttpException('Email já está em uso', HttpStatus.BAD_REQUEST),
      );

      expect(repository.findUnique).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });

      expect(repository.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('deve retornar uma lista de usuários', async () => {
      const users = [
        {
          id: 1,
          email: 'user1@example.com',
          current: 100,
          password: 'hashedPassword1',
        },
        {
          id: 2,
          email: 'user2@example.com',
          current: 200,
          password: 'hashedPassword2',
        },
      ];

      repository.findMany.mockResolvedValue(users);

      const result = await service.findAll();

      expect(repository.findMany).toHaveBeenCalledWith({});
      expect(result).toEqual(
        users.map((user) => ({
          id: user.id,
          email: user.email,
          current: user.current,
          password: user.password,
        })),
      );
    });

    it('deve lançar uma exceção se ocorrer um erro', async () => {
      repository.findMany.mockRejectedValue(
        new Error('Erro no banco de dados'),
      );

      await expect(service.findAll()).rejects.toThrow(
        new HttpException(
          'Erro ao buscar os usuários.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );

      expect(repository.findMany).toHaveBeenCalledWith({});
    });
  });

  describe('findOne', () => {
    it('deve retornar um usuário se encontrado', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        current: 100,
        password: 'hashedPassword',
      };

      repository.findUnique.mockResolvedValue(user);

      const result = await service.findOne(1);

      expect(repository.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });

      expect(result).toEqual({
        id: user.id,
        email: user.email,
        current: user.current,
        password: user.password,
      });
    });

    it('deve lançar uma exceção se o usuário não for encontrado', async () => {
      repository.findUnique.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(
        new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND),
      );

      expect(repository.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('update', () => {
    it('deve atualizar um usuário com sucesso', async () => {
      const updateUserDto: UpdateUserDto = {
        email: 'updated@example.com',
        password: 'newPassword123',
      };

      const existingUser = {
        id: 1,
        email: 'test@example.com',
        current: 100,
        password: 'oldHashedPassword',
      };

      const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);

      const updatedUser = {
        id: 1,
        email: updateUserDto.email,
        current: existingUser.current,
        password: hashedPassword,
      };

      repository.findUnique.mockResolvedValue(existingUser);
      repository.update.mockResolvedValue(updatedUser);

      const result = await service.update(1, updateUserDto);

      expect(repository.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });

      expect(repository.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          ...updateUserDto,
          password: expect.any(String),
        },
      });

      expect(result).toEqual({
        id: updatedUser.id,
        email: updatedUser.email,
        current: updatedUser.current,
        password: updatedUser.password,
      });
    });

    it('deve lançar uma exceção se o usuário não for encontrado', async () => {
      repository.findUnique.mockResolvedValue(null);

      await expect(service.update(1, {})).rejects.toThrow(
        new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND),
      );

      expect(repository.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });

      expect(repository.update).not.toHaveBeenCalled();
    });
  });

  describe('findByEmail', () => {
    it('deve retornar um usuário se encontrado', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        current: 100,
        password: 'hashedPassword',
      };

      repository.findUnique.mockResolvedValue(user);

      const result = await service.findByEmail('test@example.com');

      expect(repository.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });

      expect(result).toEqual(user);
    });

    it('deve retornar null se o usuário não for encontrado', async () => {
      repository.findUnique.mockResolvedValue(null);

      const result = await service.findByEmail('test@example.com');

      expect(repository.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });

      expect(result).toBeNull();
    });
  });
});
