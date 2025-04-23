import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SensorData, SensorDataDocument } from '../models/sensordata.schema';

@Injectable()
export class SensorDataService {
  private readonly logger = new Logger(SensorDataService.name); // Logger für den Service

  constructor(
    @InjectModel(SensorData.name) private readonly sensorDataModel: Model<SensorDataDocument>,
  ) {}

  // Methode zum Speichern der Sensordaten
  async storeSensorData(data: SensorData): Promise<SensorData> {
    try {
      // Validierung der Sensordaten vor dem Speichern
      if (data.yaw < 0 || data.yaw > 360) {
        this.logger.error('Ungültiger Wert für yaw');
        throw new Error('Yaw muss zwischen 0 und 360 liegen');
      }
      if (data.loudness < 0) {
        this.logger.error('Lautstärke muss positiv sein');
        throw new Error('Lautstärke muss positiv sein');
      }
      if (data.timer < 0) {
        this.logger.error('Timerwert darf nicht negativ sein');
        throw new Error('Timerwert darf nicht negativ sein');
      }
      if (data.distance < 0) {
        this.logger.error('Distanz darf nicht negativ sein');
        throw new Error('Distanz darf nicht negativ sein');
      }

      // Speichern der validierten Sensordaten
      const newData = new this.sensorDataModel(data);
      const savedData = await newData.save();

      this.logger.log('Sensordaten erfolgreich gespeichert');
      return savedData;
    } catch (error) {
      this.logger.error('Fehler beim Speichern der Sensordaten', error.stack);
      throw new Error('Fehler beim Speichern der Sensordaten');
    }
  }
}
