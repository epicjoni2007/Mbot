import { Module } from '@nestjs/common';
import { Mbot2Service } from './mbot2.service';
import { Mbot2Controller } from './mbot2.controller';

@Module({
  providers: [Mbot2Service],
  controllers: [Mbot2Controller],
})
export class Mbot2Module {}
