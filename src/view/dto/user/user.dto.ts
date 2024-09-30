import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Email do usuário',
    example: 'usuario@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'senhaSegura123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Valor atual',
    example: 0,
  })
  @IsInt()
  current: number;
}

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Email do usuário',
    example: 'usuario@example.com',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: 'Senha do usuário',
    example: 'novaSenhaSegura123',
  })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiPropertyOptional({
    description: 'Valor atual',
    example: 2,
  })
  @IsInt()
  @IsOptional()
  current?: number;
}
