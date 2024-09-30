import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from 'src/view/dto/';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from 'src/view/dto/user/user.entity';
import { UserService } from 'src/context/service';
import { JwtStrategy } from 'src/auth/service/jwt.strategy';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';

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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  findAll() {
    return this.usersService.findAll();
  }
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
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
