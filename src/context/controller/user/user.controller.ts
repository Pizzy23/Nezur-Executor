import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from 'src/view/dto/';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from 'src/view/dto/user/user.entity';
import { UserService } from 'src/context/service';

@Controller('Users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UserService) {}

  @ApiOperation({
    summary: 'Rota para criação de um usuário.',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso.',
    type: UserEntity,
  })
  @Post('/')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({
    summary: 'Lista todos os usuários.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários retornada com sucesso.',
    type: [UserEntity],
  })
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiOperation({
    summary: 'Obtém um usuário pelo ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário retornado com sucesso.',
    type: UserEntity,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @ApiOperation({
    summary: 'Atualiza um usuário existente.',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário atualizado com sucesso.',
    type: UserEntity,
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }
}
