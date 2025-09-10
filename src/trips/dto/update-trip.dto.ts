import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateTripDto {
  @IsOptional()
  @IsString()
  departure?: string;

  @IsOptional()
  @IsString()
  destination?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
