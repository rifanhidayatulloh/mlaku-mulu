import { IsDateString, IsString, IsNotEmpty } from 'class-validator';

export class CreateTripDto {
  @IsString()
  @IsNotEmpty()
  departure: string;

  @IsString()
  @IsNotEmpty()
  destination: string;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  endDate: string;
}
