import { Schema, Document } from 'mongoose';

export interface Track {
  id: string; // Eindeutige ID
  duration: number; // Dauer des Tracks in Sekunden
  direction: string; // Richtung des Tracks (z. B. "N", "S", "E", "W")
  speed: number; // Geschwindigkeit des Tracks
  timestamp?: Date; // Optionaler Zeitstempel
}

// Kombiniere das Track-Interface mit Mongoose's Document
export type TrackDocument = Track & Document;

export const TrackSchema = new Schema<TrackDocument>({
  id: { type: String, required: true, unique: true }, // Eindeutige ID
  duration: { type: Number, required: true }, // Dauer
  direction: { type: String, required: true }, // Richtung
  speed: { type: Number, required: true }, // Geschwindigkeit
  timestamp: { type: Date, default: Date.now }, // Optionaler Zeitstempel mit Standardwert
});