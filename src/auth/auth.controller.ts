import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Public } from '../common/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() body: LoginDto) {
    const user = await this.authService.validateUser(body.email, body.password);
    return this.authService.login(user);
  }

  @Public()
  @Post('register')
  async register(@Body() body: RegisterDto) {
    const user = await this.authService.register(body.email, body.name, body.password, body.role);
    return { id: user.id, email: user.email, name: user.name, role: user.role };
  }
}
