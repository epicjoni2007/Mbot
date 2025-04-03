import { Schema, Document } from 'mongoose';

export interface Track extends Document {
  duration: number;
  direction: string;
  speed: number;
  timestamp: Date;
}

export const TrackSchema = new Schema<Track>({
  duration: { type: Number, required: true },
  direction: { type: String, required: true },
  speed: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});