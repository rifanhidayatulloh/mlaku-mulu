import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trip } from '../entities/trip.entity';
import { Role, User } from '../entities/user.entity';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';

@Injectable()
export class TripsService {
  constructor(
    @InjectRepository(Trip) private repo: Repository<Trip>,
    @InjectRepository(User) private usersRepo: Repository<User>,
  ) {}

  async createForUser(userId: number, dto: CreateTripDto) {
    const user = await this.usersRepo.findOne({ where: { id: userId, role: Role.TOURIST } });
    if (!user) throw new NotFoundException('Tourist not found');

    const trip = this.repo.create({ ...dto, tourist: user });
    const savedTrip = await this.repo.save(trip);
    return {
      ...savedTrip,
      tourist: { id: user.id, name: user.name, email: user.email },
    }
  }

  async findAllForUser(userId: number) {
    return this.repo.find({ where: { tourist: { id: userId } } });
  }

  async findAll() {
    return this.repo.find();
  }

  async updateTrip(id: number, dto: UpdateTripDto) {
    const trip = await this.repo.findOne({ where: { id } });
    if (!trip) throw new NotFoundException('Trip not found');
    Object.assign(trip, dto);
    const savedTrip = await this.repo.save(trip);
    return {
      ...savedTrip,
      tourist: { id: trip.tourist.id, name: trip.tourist.name, email: trip.tourist.email }
    }
  }

  async removeTrip(id: number) {
    const trip = await this.repo.findOne({ where: { id } });
    if (!trip) throw new NotFoundException('Trip not found');
    await this.repo.remove(trip);
    return { deleted: true };
  }
}
