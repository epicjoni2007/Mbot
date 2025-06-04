import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { MovementAction } from './movementaction.schema';

export type TrackDocument = Track & Document;

@Schema({ timestamps: true })
export class Track {
  @Prop({ type: [{ type: Types.ObjectId, ref: 'MovementAction' }] })
  actions: Types.ObjectId[];
}

export const TrackSchema = SchemaFactory.createForClass(Track);
