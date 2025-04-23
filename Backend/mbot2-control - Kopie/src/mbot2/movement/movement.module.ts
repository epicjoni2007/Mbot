import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Movement, MovementSchema } from './schemas/movement.schema';
import { MovementService } from './movement.service';
import { MovementController } from './movement.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Movement.name, schema: MovementSchema }])],
  controllers: [MovementController],
  providers: [MovementService],
  exports: [MongooseModule]
})
export class MovementModule {}
