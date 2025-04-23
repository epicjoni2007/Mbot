import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MovementModule } from './mbot2/movement/movement.module';
import { Mbot2Module } from './mbot2/mbot2.module';
import {TrackSchema} from './mbot2/models/tracks.schema';
import {SensorDataService} from './mbot2/services/sensordata.service';
import {TrackService} from './mbot2/services/tracks.service';
//import {SensorDataController} from './mbot2/controllers/sensordata.controller';
import {TrackController} from './mbot2/controllers/tracks.controller';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://philipellmauthaler:admin@cluster0.9ht1c.mongodb.net/mbotDB?retryWrites=true&w=majority&appName=Cluster0'),
    MongooseModule.forFeature([
      { name: 'Track', schema: TrackSchema },
    ]),
    MovementModule,
    Mbot2Module,
  ],
  controllers: [/*SensorDataController,*/ TrackController],
  providers: [/*SensorDataService,*/ TrackService],
})
export class AppModule {}
