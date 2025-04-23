import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type Mbot2Document = Mbot2 & Document;

@Schema()
export class Mbot2 {
  @Prop({ required: true })
  name: string;

  @Prop()
  status: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const Mbot2Schema = SchemaFactory.createForClass(Mbot2);
