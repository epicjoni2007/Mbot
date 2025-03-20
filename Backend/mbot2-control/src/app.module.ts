import { Module } from '@nestjs/common';
import { Mbot2Module } from './mbot2/mbot2.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    Mbot2Module,
    MongooseModule.forRoot('mongodb+srv://philipellmauthaler:admin@cluster0.9ht1c.mongodb.net/mbotDB?retryWrites=true&w=majority&appName=Cluster0')
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
