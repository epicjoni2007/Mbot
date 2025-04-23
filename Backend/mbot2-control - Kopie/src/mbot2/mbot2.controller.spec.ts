import { Test, TestingModule } from '@nestjs/testing';
import { Mbot2Controller } from './mbot2.controller';

describe('Mbot2Controller', () => {
  let controller: Mbot2Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Mbot2Controller],
    }).compile();

    controller = module.get<Mbot2Controller>(Mbot2Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
