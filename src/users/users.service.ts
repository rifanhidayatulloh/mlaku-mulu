import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Role } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) { }

  async findAllUsers() {
    return this.repo.find();
  }

  async findAllTourists() {
    return this.repo.find({ where: { role: Role.TOURIST } });
  }

  async findById(id: number) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(dto: CreateUserDto) {
    const exists = await this.repo.findOne({ where: { email: dto.email } });
    if (exists) throw new BadRequestException('Email already in use');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = this.repo.create({ email: dto.email, name: dto.name, passwordHash, role: dto.role });
    return this.repo.save(user);
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.findById(id);
    const exists = await this.repo.findOne({ where: { email: dto.email } });
    if (exists && exists.id !== id) throw new BadRequestException('Email already in use');
    if (user.role === Role.EMPLOYEE) {
      throw new BadRequestException('Cannot change employee role');
    }

    if (dto.password) {
      user.passwordHash = await bcrypt.hash(dto.password, 10);
      delete (dto as any).password;
    }
    Object.assign(user, dto);
    this.repo.save(user);
    const { passwordHash, ...result } = user;
    return result;
  }

  async remove(id: number) {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('User not found');
    await this.repo.remove(user);
    return { deleted: true };
  }
}
