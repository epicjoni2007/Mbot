import { Controller, Get, Post, Body } from '@nestjs/common';
import { Mbot2Service } from './mbot2.service';

@Controller('')
export class Mbot2Controller {
  constructor(private readonly mbotService: Mbot2Service) {}

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
    return await this.mbotService.stopRecording();
  }

  // Endpoint to replay track
  @Post('replay')
  async replayTrack() {
    return await this.mbotService.replayTrack();
  }

  // Endpoint to get track
  @Get('track')
  async getTrack() {
    return await this.mbotService.getTrack();
  }

  @Get('sensor-data')
  async getSensorData() {
    return await this.mbotService.getSensorData();
  }

  // Endpoint to control the LED
  @Post('led')
  async setLed(@Body() body: { r: number; g: number; b: number }) {
    const { r, g, b } = body;
    return await this.mbotService.setLedColor(r, g, b);
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
