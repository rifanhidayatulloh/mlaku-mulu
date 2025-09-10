import { IsEmail, IsEnum, IsOptional, IsString, MinLength, IsNotEmpty } from 'class-validator';
import { Role } from '../../entities/user.entity';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  @IsNotEmpty()
  email?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @MinLength(6)
  @IsNotEmpty()
  password?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
