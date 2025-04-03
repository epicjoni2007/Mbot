import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Track } from '../models/tracks.schema';

@Injectable()
export class TracksService {
  constructor(@InjectModel('Track') private readonly trackModel: Model<Track>) {}

  async saveTracks(tracks: Track[]): Promise<Track[]> {
    return this.trackModel.insertMany(tracks);
  }
}
