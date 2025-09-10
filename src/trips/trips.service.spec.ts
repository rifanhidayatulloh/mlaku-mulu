import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TripsService } from './trips.service';
import { Trip } from '../entities/trip.entity';
import { User } from '../entities/user.entity';

type MockRepo<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const mockTripRepo: MockRepo = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
};

const mockUserRepo: MockRepo = {
  findOne: jest.fn(),
};

describe('TripsService', () => {
  let service: TripsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TripsService,
        { provide: getRepositoryToken(Trip), useValue: mockTripRepo },
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
      ],
    }).compile();

    service = module.get<TripsService>(TripsService);
    jest.clearAllMocks();
  });

  it('should create trip for user', async () => {
    (mockUserRepo.findOne as any).mockResolvedValue({ id: 1 } as User);
    (mockTripRepo.create as any).mockReturnValue({});
    (mockTripRepo.save as any).mockImplementation(async (t) => ({ id: 1, ...t }));
    const trip = await service.createForUser(1, {
      departure: 'A', destination: 'B', startDate: '2025-01-01', endDate: '2025-01-02'
    });
    expect(trip.id).toBe(1);
  });
});
