import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MovementActionDocument = MovementAction & Document;

@Schema()
export class MovementAction {
  @Prop({ required: true })
  direction: string;

  @Prop({ required: true })
  speed: number;

  @Prop({ required: true })
  duration: number;

  @Prop()
  rotation?: number;
}

export const MovementActionSchema = SchemaFactory.createForClass(MovementAction);
