import { Body, Controller, Delete, Get, Param, ParseIntPipe, Put, Post, Req } from '@nestjs/common';
import { TripsService } from './trips.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { Roles } from '../common/roles.decorator';
import { Role } from '../entities/user.entity';

@Controller()
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  // Tourist creates own trip
  @Roles(Role.TOURIST)
  @Post('trips')
  createMyTrip(@Req() req: any, @Body() body: CreateTripDto) {
    return this.tripsService.createForUser(req.user.userId, body);
  }

  // Tourist list own trips
  @Roles(Role.TOURIST)
  @Get('trips')
  listMyTrips(@Req() req: any) {
    return this.tripsService.findAllForUser(req.user.userId);
  }

  @Roles(Role.EMPLOYEE)
  @Get('trips/all')
  getAllTripsForTourist() {
    return this.tripsService.findAll();
  }

  // Employees manage any tourist's trips
  @Roles(Role.EMPLOYEE)
  @Post('employees/tourists/:id/trips')
  createTripForTourist(@Param('id', ParseIntPipe) id: number, @Body() body: CreateTripDto) {
    return this.tripsService.createForUser(id, body);
  }

  @Roles(Role.EMPLOYEE)
  @Put('employees/trips/:id')
  updateTrip(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateTripDto) {
    return this.tripsService.updateTrip(id, body);
  }

  @Roles(Role.EMPLOYEE)
  @Delete('employees/trips/:id')
  deleteTrip(@Param('id', ParseIntPipe) id: number) {
    return this.tripsService.removeTrip(id);
  }
}
