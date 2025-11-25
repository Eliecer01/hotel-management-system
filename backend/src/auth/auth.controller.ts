import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { IsNotEmpty, IsString } from 'class-validator';

// 1. Definimos el DTO aquí mismo (o en un archivo aparte) para tipar la entrada
class LoginDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  // 2. Usamos LoginDto en lugar de Record<string, any>
  async login(@Body() signInDto: LoginDto) {
    const user = await this.authService.validateUser(
      signInDto.username,
      signInDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // 3. TypeScript sabe que user tiene userId y username gracias al servicio
    return this.authService.login({
      userId: user.userId,
      username: user.username,
    });
  }
}
