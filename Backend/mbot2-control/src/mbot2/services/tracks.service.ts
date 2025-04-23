import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Track, TrackDocument } from '../models/tracks.schema'; // Ensure TrackDocument is exported from tracks.schema.ts

@Injectable()
export class TrackService {
  constructor(@InjectModel('Track') private readonly trackModel: Model<TrackDocument>) {}

  // Retrieve the latest track from the database
  async getLatestTracks(): Promise<Track | null> {
    return this.trackModel.findOne().sort({ id: -1 }).exec(); // Sort by id in descending order and return the first result
  }

  // Retrieve a track by its ID
  async getTrackById(id: string): Promise<Track | null> {
    return this.trackModel.findOne({ id }).exec();
  }

  // Save a track with a unique ID
  async saveTrackWithId(trackData: Partial<Track>): Promise<Track> {
    try {
      // Generiere eine neue ID basierend auf der höchsten vorhandenen ID
      const lastTrack = await this.trackModel.findOne().sort({ id: -1 }).exec();
      const newId = lastTrack ? parseInt(lastTrack.id, 10) + 1 : 1;

      const newTrack = new this.trackModel({
        ...trackData,
        id: newId.toString(),
      });

      return newTrack.save();
    } catch (error) {
      console.error('Fehler beim Speichern des Tracks:', error.message, error.stack);
      throw new Error('Fehler beim Speichern des Tracks');
    }
  }
}