import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class SensorData {
  @Prop({ required: true })
  yaw: number;

  @Prop({ required: true })
  loudness: number;

  @Prop({ required: true })
  timer: number;

  @Prop({ required: true })
  distance: number;
}

// Definiere den Mongoose-Dokument-Typ
export type SensorDataDocument = SensorData & Document;

// Erstelle das Schema
export const SensorDataSchema = SchemaFactory.createForClass(SensorData);
