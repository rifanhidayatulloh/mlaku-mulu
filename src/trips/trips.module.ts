import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trip } from '../entities/trip.entity';
import { User } from '../entities/user.entity';
import { TripsService } from './trips.service';
import { TripsController } from './trips.controller';
import { UsersService } from '../users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([Trip, User])],
  providers: [TripsService, UsersService],
  controllers: [TripsController],
})
export class TripsModule {}
