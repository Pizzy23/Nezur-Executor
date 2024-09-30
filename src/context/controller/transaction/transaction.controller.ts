import { TransactionService } from 'src/context/service';
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
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateTransferDto,
  TransferEntity,
  UpdateTransferDto,
} from 'src/view/dto';

@ApiTags('Transaction')
@Controller('/Transaction')
export class TransactionController {
  constructor(private readonly service: TransactionService) {}

  @ApiOperation({
    summary: '',
  })
  @ApiResponse({
    status: 201,
    description: 'Transferencia criado com sucesso.',
    type: TransferEntity,
  })
  @Post('/')
  async postTransaction(@Body() input: CreateTransferDto) {
    return await this.service.transferCurrent(input);
  }

  @ApiOperation({
    summary: '',
  })
  @ApiResponse({
    status: 200,
    description: 'Todas as Transferencia feitas.',
    type: TransferEntity,
  })
  @Get('/')
  async getTransaction() {
    return await this.service.getAllTransfer();
  }

  @ApiOperation({
    summary: '',
  })
  @ApiResponse({
    status: 200,
    description: 'Ajusta a transferencia atual.',
    type: TransferEntity,
  })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateTransferDto,
  ) {
    return await this.service.updateTransfer(id, updateUserDto);
  }
}
