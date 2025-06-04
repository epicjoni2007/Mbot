// src/services/tracks.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Track, TrackDocument } from '../models/tracks.schema';

@Injectable()
export class TrackService {
  constructor(@InjectModel('Track') private readonly trackModel: Model<TrackDocument>) {}

  async getLatestTracks(): Promise<Track | null> {
    return this.trackModel.findOne().sort({ id: -1 }).exec();
  }

  async getTrackById(id: string): Promise<Track | null> {
    return this.trackModel.findOne({ id }).exec();
  }

  async saveTrackWithId(trackData: { movements: any[] }): Promise<Track> {
    try {
      const lastTrack = await this.trackModel.findOne().sort({ id: -1 }).exec();
      const newId = lastTrack ? parseInt(lastTrack.id, 10) + 1 : 1;

      const newTrack = new this.trackModel({
        id: newId.toString(),
        movements: trackData.movements,
      });

      return newTrack.save();
    } catch (error) {
      console.error('Fehler beim Speichern des Tracks:', error.message);
      throw new Error('Fehler beim Speichern des Tracks');
    }
  }
}
