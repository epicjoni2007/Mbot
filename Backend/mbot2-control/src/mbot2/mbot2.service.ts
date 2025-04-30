import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Track } from './models/tracks.schema';

// Target Server Configuration
const TARGET_IP = '10.10.2.137'; // IP of the mBot2 HTTP server
const GENERAL_PORT = 8080; // Port for all requests

@Injectable()
export class Mbot2Service {
  // Function to send HTTP requests
  private async sendHttpRequest(method: 'POST' | 'GET', endpoint: string, payload: any = null) {
    const url = `http://${TARGET_IP}:${GENERAL_PORT}/${endpoint}`;
    try {
      let response;
      if (method === 'POST') {
        response = await axios.post(url, payload);
      } else if (method === 'GET') {
        response = await axios.get(url);
      } else {
        throw new Error(`Unsupported HTTP method: ${method}`);
      }
      return response.data;
    } catch (error) {
      console.error('Error sending request:', error.message);
      return null;
    }
  }

  // Function to send movement command
  async sendMovementCommand(direction: string, speed: number, r: number = 0, g: number = 0, b: number = 0) {
    const command = { direction, speed, R: r, G: g, B: b };
    return await this.sendHttpRequest('POST', 'move', command);
  }
  // Sensordata
  async getSensorDataFromMbot(): Promise<any> {
    return await this.sendHttpRequest('GET', 'sensor-data');
  }

  // Function to start recording
  async startRecording() {
    return await this.sendHttpRequest('POST', 'start_recording');
  }

  // Function to stop recording
  async stopRecording(): Promise<any> {
    // Simuliere Track-Daten
    return {
      message: 'Recording stopped',
      track: [
        {
          duration: 3895,
          direction: 'forward',
          speed: 10,
        },
      ],
    };
  }

  // Function to replay track
  async replayTrack(track: Track): Promise<string> {
    // Simuliere die Logik für das Abfahren des Tracks
    console.log(`Starte Replay des Tracks:`, track);

    // Hier könntest du die Logik implementieren, um den Track tatsächlich abzufahren
    // Zum Beispiel: Sende Befehle an den Roboter basierend auf den Track-Daten

    return await this.sendHttpRequest('POST', 'replay');
  }

  // Function to get track
  async getTrack() {
    return await this.sendHttpRequest('GET', 'get_track');
  }

  async getCartography() {
    return await this.sendHttpRequest('GET', 'cartography');
  }

  async stopCartography() {
    return await this.sendHttpRequest('POST', 'stopcartography');
  }

  // Function to control LED
  async setLedColor(r: number, g: number, b: number) {
    const command = { R: r, G: g, B: b };
    return await this.sendHttpRequest('POST', 'led', command);
  }



  async executeMovementMap(map: { direction: string, speed: number, duration: number, rotation?: number }[]) {
    return await this.sendHttpRequest('POST', 'execute_map', { map });
  }

  async getStatus() {
    return await this.sendHttpRequest('GET', 'status');
  }
}
