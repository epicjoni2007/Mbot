import { Module } from '@nestjs/common';
import { Mbot2Module } from './mbot2/mbot2.module';

@Module({
  imports: [Mbot2Module],
  controllers: [],
  providers: [],
})
export class AppModule {}
