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
export class CreateTransferDto {
  @ApiProperty({
    description: 'Email do usuário que vai enviar',
    example: 'usuario@example.com',
  })
  @IsEmail()
  sender: string;

  @ApiProperty({
    description: 'Email do usuário que vai receber',
    example: 'usuario@example.com',
  })
  @IsEmail()
  received: string;

  @ApiProperty({
    description: 'Valor atual da transferência',
    example: 0,
  })
  @IsInt()
  current: number;

  @ApiProperty({
    description: 'Status da transferência',
    example: StatusEnum.ANALYSE,
    enum: StatusEnum,
  })
  @IsEnum(StatusEnum)
  status: StatusEnum;
}
export class UpdateTransferDto {

  @ApiProperty({
    description: 'Status da transferência',
    example: StatusEnum.VALID,
    enum: StatusEnum,
  })
  @IsEnum(StatusEnum)
  status: StatusEnum;
  
}
