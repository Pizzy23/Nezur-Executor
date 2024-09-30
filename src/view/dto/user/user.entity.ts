import { ApiProperty } from '@nestjs/swagger';

export class UserEntity {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'usuario@example.com' })
  email: string;

  @ApiProperty({ example: 1 })
  current: number;

  @ApiProperty({ example: "273dasnu" })
  password: string;

}
