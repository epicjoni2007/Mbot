import { Controller, Post, Body } from '@nestjs/common';
import { TracksService } from '../services/tracks.service';
import { Track } from '../models/tracks.schema';

@Controller('tracks')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Post('save')
  async saveTracks(@Body() tracks: Track[]) {
    return this.tracksService.saveTracks(tracks);
  }
}
