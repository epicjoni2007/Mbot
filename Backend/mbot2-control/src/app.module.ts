import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MovementModule } from './mbot2/movement/movement.module';
import { Mbot2Module } from './mbot2/mbot2.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://philipellmauthaler:admin@cluster0.9ht1c.mongodb.net/mbotDB?retryWrites=true&w=majority&appName=Cluster0'),
    MovementModule,
    Mbot2Module,
  ],
})
export class AppModule {}
