import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MovementDocument = Movement & Document;

@Schema()
export class Movement {
  @Prop({ required: true })
  duration: number;

  @Prop({ required: true })
  direction: string;

  @Prop({ required: true })
  speed: number;
}

export const MovementSchema = SchemaFactory.createForClass(Movement);
