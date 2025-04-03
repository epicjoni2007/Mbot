import { Controller, Post, Body } from '@nestjs/common';
import { SensorDataService } from '../services/sensordata.service';
import { SensorData } from '../models/sensordata.schema';

@Controller('sensor-data')
export class SensorDataController {
  constructor(private readonly sensorDataService: SensorDataService) {}

  @Post('save')
  async saveSensorData(@Body() data: SensorData) {
    return this.sensorDataService.saveSensorData(data);
  }
}