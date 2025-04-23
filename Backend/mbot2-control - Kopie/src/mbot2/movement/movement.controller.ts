import { Controller, Get, Post, Body } from '@nestjs/common';
import { MovementService } from './movement.service';
import { Movement } from './schemas/movement.schema';

@Controller('movement')
export class MovementController {
  constructor(private readonly movementService: MovementService) {}

  @Post()
  async create(@Body() movementData: Movement): Promise<Movement> {
    return this.movementService.create(movementData);
  }

  @Get()
  async findAll(): Promise<Movement[]> {
    return this.movementService.findAll();
  }
}
