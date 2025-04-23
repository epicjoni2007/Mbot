import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Mbot2Controller } from './mbot2.controller';
import { Mbot2Service } from './mbot2.service';
import { SensorDataService } from './services/sensordata.service';
import { SensorDataSchema } from './models/sensordata.schema';
import { TrackService } from './services/tracks.service';
import { TrackSchema } from './models/tracks.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'SensorData', schema: SensorDataSchema }, // Registriere das SensorData-Schema
      { name: 'Track', schema: TrackSchema }, // Registriere das Track-Schema
    ]),
  ],
  controllers: [Mbot2Controller],
  providers: [Mbot2Service, SensorDataService, TrackService], // Registriere die Services
})
export class Mbot2Module {}
