import { Test, TestingModule } from '@nestjs/testing';
import { Mbot2Service } from './mbot2.service';

describe('Mbot2Service', () => {
  let service: Mbot2Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Mbot2Service],
    }).compile();

    service = module.get<Mbot2Service>(Mbot2Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
