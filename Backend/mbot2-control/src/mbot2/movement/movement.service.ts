import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movement, MovementDocument } from './schemas/movement.schema';

@Injectable()
export class MovementService {
  constructor(@InjectModel(Movement.name) private movementModel: Model<MovementDocument>) {}

  async create(movementData: Movement): Promise<Movement> {
    const newMovement = new this.movementModel(movementData);
    return newMovement.save();
  }

  async findAll(): Promise<Movement[]> {
    return this.movementModel.find().exec();
  }
}
