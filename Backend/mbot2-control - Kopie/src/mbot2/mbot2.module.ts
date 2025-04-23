import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Mbot2, Mbot2Schema } from './mbot2.schema';
import { Mbot2Service } from './mbot2.service';
import { Mbot2Controller } from './mbot2.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Mbot2.name, schema: Mbot2Schema }])
  ],
  controllers: [Mbot2Controller],
  providers: [Mbot2Service],
})
export class Mbot2Module {}
