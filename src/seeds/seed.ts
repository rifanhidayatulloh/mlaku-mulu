import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { User, Role } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Trip } from '../entities/trip.entity';
import { typeOrmConfig } from '../config/typeorm.config';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  ConfigModule.forRoot({ isGlobal: true });
  const config = new ConfigService();
  const ds = new DataSource(typeOrmConfig(config));
  await ds.initialize();
  const userRepo = ds.getRepository(User);

  const email = 'employee@mlaku.com';
  const exists = await userRepo.findOne({ where: { email } });
  if (!exists) {
    const employee = new User();
    employee.email = email;
    employee.name = 'Employee Satu';
    employee.role = Role.EMPLOYEE;
    employee.passwordHash = await bcrypt.hash('Password123!', 10);
    await userRepo.save(employee);
    console.log('Seeded employee:', email, 'Password123!');
  } else {
    console.log('Employee already exists, skipping.');
  }
  await ds.destroy();
}

bootstrap().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
