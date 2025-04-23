import { Controller, Get, Post, Body } from '@nestjs/common';
import { TrackService } from '../services/tracks.service';
import { Track } from '../models/tracks.schema';

@Controller('tracks')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  /**
   * Gibt den letzten gespeicherten Track zurück.
   */
  @Get('latest')
  async getLatestTrack(): Promise<Track | null> {
    return await this.trackService.getLatestTracks();
  }

  /**
   * Speichert neue Tracks in der Datenbank.
   */
  @Post('save')
  async saveTracks(@Body() tracks: Track[]): Promise<Track[]> {
    return await this.trackService.saveTracks(tracks);
  }
}