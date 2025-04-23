import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Track } from '../models/tracks.schema';

@Injectable()
export class TrackService {
  constructor(@InjectModel('Track') private readonly trackModel: Model<Track>) {}

  /**
   * Gibt den zuletzt gespeicherten Track aus der Datenbank zurück.
   */
  async getLatestTracks(): Promise<Track | null> {
    return this.trackModel.findOne().sort({ timestamp: -1 }).exec();
  }

  /**
   * Speichert eine neue Track-Liste in der Datenbank.
   */
  async saveTracks(tracks: Track[]): Promise<Track[]> {
    return this.trackModel.insertMany(tracks);
  }
}