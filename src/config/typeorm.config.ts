import { ConfigService } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';
import { User } from '../entities/user.entity';
import { Trip } from '../entities/trip.entity';

export const typeOrmConfig = (config: ConfigService): DataSourceOptions => ({
  type: 'postgres',
  host: config.get('DATABASE_HOST'),
  port: parseInt(config.get('DATABASE_PORT') || '5433', 10),
  username: config.get('DATABASE_USER'),
  password: config.get('DATABASE_PASSWORD'),
  database: config.get('DATABASE_NAME'),
  entities: [User, Trip],
  synchronize: true,
  logging: false,
});
