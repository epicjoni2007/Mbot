/*import { Controller, Post, Get, Body } from '@nestjs/common';
import { SensorDataService } from '../services/sensordata.service';
import { SensorData } from '../models/sensordata.schema';

@Controller('sensordata')
export class SensorDataController {
  constructor(private readonly sensorDataService: SensorDataService) {}

  @Get()
  async getSensorData(): Promise<SensorData> {
    const sensorData = await this.sensorDataService.getLatestSensorData();
    await this.sensorDataService.saveSensorData(sensorData); // Speichert automatisch in DB
    return sensorData;
  }
}
*/