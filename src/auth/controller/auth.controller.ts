import { Controller, Post, Body, HttpException, HttpStatus} from '@nestjs/common';
import { LoginDto } from 'src/view/dto/login/login.dto';
import { AuthService } from '../service/auth.service';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!user) {
      throw new HttpException('Email ou senha incorretos',HttpStatus.UNAUTHORIZED);
    }
    return this.authService.login(user);
  }
}
