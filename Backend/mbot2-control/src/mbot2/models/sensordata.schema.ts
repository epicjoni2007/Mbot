import { Schema, Document } from 'mongoose';

export interface SensorData extends Document {
  yaw: number;
  loudness: number;
  timer: number;
  distance: number;
  timestamp: Date;
}

export const SensorDataSchema = new Schema<SensorData>({
  yaw: { type: Number, required: true },
  loudness: { type: Number, required: true },
  timer: { type: Number, required: true },
  distance: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});
