import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Role } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<User> {
    const user = await this.usersRepo.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const match = await bcrypt.compare(pass, user.passwordHash);
    if (!match) throw new UnauthorizedException('Invalid credentials');
    return user;
  }

  async login(user: User) {
    const payload = { sub: user.id, role: user.role, email: user.email, name: user.name };
    return { access_token: await this.jwtService.signAsync(payload) };
  }

  async register(email: string, name: string, password: string, role: Role = Role.TOURIST) {
    const exists = await this.usersRepo.findOne({ where: { email } });
    if (exists) throw new BadRequestException('Email already in use');
    const passwordHash = await bcrypt.hash(password, 10);
    const user = this.usersRepo.create({ email, name, passwordHash, role });
    await this.usersRepo.save(user);
    return user;
  }
}
