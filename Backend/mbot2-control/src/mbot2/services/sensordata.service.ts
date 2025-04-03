import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SensorData } from '../models/sensordata.schema';

@Injectable()
export class SensorDataService {
  constructor(@InjectModel('SensorData') private readonly sensorDataModel: Model<SensorData>) {}

  async saveSensorData(data: SensorData): Promise<SensorData> {
    const newData = new this.sensorDataModel(data);
    return newData.save();
  }
}
