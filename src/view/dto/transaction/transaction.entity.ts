import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { StatusEnum } from 'src/view/enums';

@Injectable()
export class TransferEntity {
  @ApiProperty({
    description: 'Id do que vai enviar',
    example: 1,
  })
  sender?: number;

  @ApiProperty({
    description: 'Id do que vai receber',
    example: 1,
  })
  received?: number;

  @ApiProperty({
    description: 'Valor atual da transferência',
    example: 0,
  })
  current?: number;

  @ApiProperty({
    description: 'Status da transferência',
    example: StatusEnum.VALID,
    enum: StatusEnum,
  })
  status: StatusEnum;
}
