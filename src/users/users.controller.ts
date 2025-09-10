import { Body, Controller, Delete, Get, Param, ParseIntPipe, Put, Post, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../common/roles.decorator';
import { Role } from '../entities/user.entity';

@Controller('employees')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Roles(Role.EMPLOYEE)
  @Get('users')
  findAllUsers() {
    return this.usersService.findAllUsers();
  }

  @Roles(Role.EMPLOYEE)
  @Get('tourists')
  findAllTourists() {
    return this.usersService.findAllTourists();
  }

  // Employees manage tourists
  @Roles(Role.EMPLOYEE)
  @Post('tourists')
  createTourist(@Body() body: CreateUserDto) {
    // enforce role to TOURIST regardless of input
    return this.usersService.create({ ...body, role: Role.TOURIST });
  }

  @Roles(Role.EMPLOYEE)
  @Put('tourists/:id')
  updateTourist(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateUserDto) {
    return this.usersService.update(id, { ...body, role: Role.TOURIST });
  }

  @Roles(Role.EMPLOYEE)
  @Delete('tourists/:id')
  removeTourist(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }

  // Profile endpoint for any logged-in user
  @Get('me')
  me(@Req() req: any) {
    return req.user;
  }
}
