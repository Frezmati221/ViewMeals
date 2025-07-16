import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Plan extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  currency: string;

  @Prop({ required: true })
  interval: string; // monthly, yearly

  @Prop({ required: true })
  stripePriceId: string;

  @Prop({ required: true })
  stripeProductId: string;

  @Prop({ type: Object })
  features: any;

  @Prop({ type: Number, default: 0 })
  freeShootings: number;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({ type: Number, default: 0 })
  sortOrder: number;
}

export const PlanSchema = SchemaFactory.createForClass(Plan);
