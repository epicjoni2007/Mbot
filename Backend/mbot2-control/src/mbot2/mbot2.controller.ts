import { Controller, Get, Post, Body, HttpException, HttpStatus, Param } from '@nestjs/common';
import { Mbot2Service } from './mbot2.service';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SensorData, SensorDataDocument } from './models/sensordata.schema'
import { SensorDataService } from './services/sensordata.service';
import { TrackService } from './services/tracks.service';

@Controller('')
export class Mbot2Controller {
  constructor(
    private readonly mbotService: Mbot2Service,
    private readonly sensorDataService: SensorDataService,
    private readonly trackService: TrackService,
  ) {}


  // Endpoint to send a movement command
  @Post('move')
  async sendCommand(@Body() body: { direction: string; speed: number; r?: number; g?: number; b?: number }) {
    const { direction, speed, r = 0, g = 0, b = 0 } = body;
    return await this.mbotService.sendMovementCommand(direction, speed, r, g, b);
  }

  // Endpoint to start recording
  @Post('start-recording')
  async startRecording() {
    return await this.mbotService.startRecording();
  }

  // Endpoint to stop recording
  @Post('stop-recording')
  async stopRecording() {
    try {
      const response = await this.mbotService.stopRecording(); // Track-Daten abrufen
      const trackData = response.track[0]; // Extrahiere die Track-Daten aus dem Array
      if (trackData) {
        const savedTrack = await this.trackService.saveTrackWithId(trackData); // Track speichern
        return {
          success: true,
          message: 'Recording gestoppt und Track gespeichert.',
          data: savedTrack,
        };
      } else {
        throw new Error('Keine Track-Daten verfügbar');
      }
    } catch (error) {
      console.error('Fehler beim Stoppen der Aufnahme:', error.message, error.stack);
      throw new HttpException(
        'Fehler beim Stoppen der Aufnahme oder Speichern des Tracks',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Endpoint to replay track
  @Post('replay/:id?')
  async replayTrack(@Param('id') id?: string) {
    try {
      let track;

      if (id) {
        // Hole den Track anhand der ID
        track = await this.trackService.getTrackById(id);
        if (!track) {
          throw new HttpException('Track nicht gefunden', HttpStatus.NOT_FOUND);
        }
      } else {
        throw new HttpException('Keine Track-ID angegeben', HttpStatus.BAD_REQUEST);
      }

      // Starte den Replay des Tracks
      const replayResult = await this.mbotService.replayTrack(track);

      return {
        success: true,
        message: `Track mit ID ${id} wird abgefahren.`,
        data: replayResult,
      };
    } catch (error) {
      console.error('Fehler beim Replay des Tracks:', error.message, error.stack);
      throw new HttpException(
        'Fehler beim Replay des Tracks',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Endpoint to get track
  @Get('track/:id?')
  async getTrack(@Param('id') id?: string) {
    try {
      let track;

      if (id) {
        // Hole den Track anhand der ID
        track = await this.trackService.getTrackById(id);
        if (!track) {
          throw new HttpException('Track nicht gefunden', HttpStatus.NOT_FOUND);
        }
      } else {
        // Hole den neuesten Track
        track = await this.trackService.getLatestTracks();
        if (!track) {
          throw new HttpException('Kein Track gefunden', HttpStatus.NOT_FOUND);
        }
      }

      return {
        success: true,
        data: track,
      };
    } catch (error) {
      throw new HttpException(
        'Fehler beim Abrufen des Tracks',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('track/latest')
  async getLatestTrack() {
    try {
      const latestTrack = await this.trackService.getLatestTracks();
      if (!latestTrack) {
        throw new HttpException('Kein Track gefunden', HttpStatus.NOT_FOUND);
      }
      return {
        success: true,
        data: latestTrack,
      };
    } catch (error) {
      throw new HttpException('Fehler beim Abrufen des neuesten Tracks', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('sensor-data')
  async getSensorData() {
    try {
      const sensorData = await this.mbotService.getSensorDataFromMbot();
      if (!sensorData) {
        throw new HttpException('Keine Sensordaten verfügbar', HttpStatus.NOT_FOUND);
      }
      return sensorData
    } catch (error) {
      console.error('Fehler beim Abrufen der Sensordaten:', error.message, error.stack);
      throw new HttpException(
        'Fehler beim Abrufen der Sensordaten',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('cartography')
  async getCartography() {
  return await this.mbotService.getCartography();
}

@Post('stopcartography')
async stopCartography() {
return await this.mbotService.stopCartography();
}
@Get('cartography-data')
async getCartographyData() {
    try {
        const data = await this.mbotService.getCartographyData();
        if (!data) {
            throw new HttpException('Keine Kartographiedaten verfügbar', 404);
        }
        return { map_points: data };
    } catch (error) {
        console.error('Fehler beim Abrufen der Kartographiedaten:', error.message);
        throw new HttpException('Fehler beim Abrufen der Kartographiedaten', 500);
    }
}

  // Endpoint to control the LED
  @Post('led')
  async setLed(@Body() body: { R: number; G: number; B: number }) {
    const { R, G, B } = body;
    return await this.mbotService.setLedColor(R, G, B);
  }

  // Endpoint to execute a predefined map of movements
  @Post('execute-map')
  async executeMap(@Body() body: { map: { direction: string, speed: number, duration: number, rotation?: number }[] }) {
    return await this.mbotService.executeMovementMap(body.map);
  }

  @Get('status')
  async getStatus() {
  return await this.mbotService.getStatus();
}
}
