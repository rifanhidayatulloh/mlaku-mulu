import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

describe('Mlaku-mulu E2E', () => {
  let app: INestApplication;
  let httpServer: any;
  let tokenTourist: string;
  let tokenEmployee: string;
  let createdTouristId: number;
  let createdTripId: number;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
    httpServer = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Register a tourist', async () => {
    const res = await request(httpServer).post('/auth/register').send({
      email: 'tourist1@mlaku.com',
      name: 'Tourist Satu',
      password: 'Password123!'
    }).expect(201);
    expect(res.body.email).toBe('tourist1@mlaku.com');
  });

  it('Login as tourist', async () => {
    const res = await request(httpServer).post('/auth/login').send({
      email: 'tourist1@mlaku.com',
      password: 'Password123!'
    }).expect(201);
    tokenTourist = res.body.access_token;
    expect(tokenTourist).toBeDefined();
  });

  it('Login as employee (seeded)', async () => {
    const res = await request(httpServer).post('/auth/login').send({
      email: 'employee@mlaku.com',
      password: 'Password123!'
    }).expect(201);
    tokenEmployee = res.body.access_token;
    expect(tokenEmployee).toBeDefined();
  });

  it('Tourist creates own trip', async () => {
    const res = await request(httpServer).post('/trips')
      .set('Authorization', `Bearer ${tokenTourist}`)
      .send({
        departure: 'Jakarta',
        destination: 'Bali',
        startDate: '2025-09-10',
        endDate: '2025-09-15',
      }).expect(201);
    createdTripId = res.body.id;
    expect(res.body.destination).toBe('Bali');
  });

  it('Tourist lists own trips', async () => {
    const res = await request(httpServer).get('/trips')
      .set('Authorization', `Bearer ${tokenTourist}`)
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('Employee creates a tourist', async () => {
    const res = await request(httpServer).post('/employees/tourists')
      .set('Authorization', `Bearer ${tokenEmployee}`)
      .send({
        email: 'tourist2@mlaku.com',
        name: 'Tourist Dua',
        password: 'Password123!',
        role: 'TOURIST'
      }).expect(201);
    createdTouristId = res.body.id;
    expect(res.body.email).toBe('tourist2@mlaku.com');
  });

  it('Employee creates a trip for tourist 2', async () => {
    const res = await request(httpServer).post(`/employees/tourists/${createdTouristId}/trips`)
      .set('Authorization', `Bearer ${tokenEmployee}`)
      .send({
        departure: 'Surabaya',
        destination: 'Yogyakarta',
        startDate: '2025-10-01',
        endDate: '2025-10-05',
      }).expect(201);
    expect(res.body.destination).toBe('Yogyakarta');
  });

  it('Employee updates a trip', async () => {
    const res = await request(httpServer).patch(`/employees/trips/${createdTripId}`)
      .set('Authorization', `Bearer ${tokenEmployee}`)
      .send({ destination: 'Lombok' }).expect(200);
    expect(res.body.destination).toBe('Lombok');
  });

  it('Employee deletes a trip', async () => {
    const res = await request(httpServer).delete(`/employees/trips/${createdTripId}`)
      .set('Authorization', `Bearer ${tokenEmployee}`)
      .expect(200);
    expect(res.body.deleted).toBe(true);
  });
});
