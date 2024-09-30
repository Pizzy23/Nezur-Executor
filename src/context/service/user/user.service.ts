import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserEntity } from 'src/view/dto/user/user.entity';
import * as bcrypt from 'bcrypt';
import { UserRepository } from 'src/context/entity';
import { CreateUserDto, UpdateUserDto } from 'src/view/dto';

@Injectable()
export class UserService {
  constructor(private readonly repository: UserRepository) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    try {
      const existingUser = await this.repository.findUnique({
        where: { email: createUserDto.email },
      });

      if (existingUser) {
        throw new HttpException('Email já está em uso', HttpStatus.BAD_REQUEST);
      }

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      const user = await this.repository.create({
        data: {
          ...createUserDto,
          password: hashedPassword,
          current: 0,
        },
      });

      return this.toUserEntity(user);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Erro ao criar o usuário.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(): Promise<UserEntity[]> {
    try {
      const users = await this.repository.findMany({});
      return users.map((user) => this.toUserEntity(user));
    } catch (error) {
      throw new HttpException(
        'Erro ao buscar os usuários.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number): Promise<UserEntity> {
    try {
      const user = await this.repository.findUnique({
        where: { id },
      });
      if (!user) {
        throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
      }
      return this.toUserEntity(user);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Erro ao buscar o usuário.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    try {
      const user = await this.repository.findUnique({ where: { id } });
      if (!user) {
        throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
      }

      if (updateUserDto.password) {
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
      }

      const updatedUser = await this.repository.update({
        where: { id },
        data: updateUserDto,
      });

      return this.toUserEntity(updatedUser);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Erro ao atualizar o usuário.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private toUserEntity(user: any): UserEntity {
    const { id, email, current, password } = user;
    return { id, email, current, password };
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    try {
      const user = await this.repository.findUnique({
        where: { email },
      });
      return user;
    } catch (error) {
      return null;
    }
  }
}
