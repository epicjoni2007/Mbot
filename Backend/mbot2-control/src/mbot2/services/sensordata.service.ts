import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SensorData, SensorDataDocument } from '../models/sensordata.schema';

@Injectable()
export class SensorDataService {
  constructor(
    @InjectModel('SensorData') private readonly sensorDataModel: Model<SensorData>, // Injiziere das Modell
  ) {}

  async storeSensorData(data: Partial<SensorData>): Promise<SensorData> {
    const newData = new this.sensorDataModel(data);
    return newData.save();
  }

  async getAllSensorData(): Promise<SensorData[]> {
    return this.sensorDataModel.find().exec();
  }
}