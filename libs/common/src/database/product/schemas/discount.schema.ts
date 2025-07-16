import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum DiscountTypeEnum {
  Percentage = 'percentage',
  Fixed = 'fixed',
}

@Schema({ timestamps: true })
export class Discount extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  code: string;

  @Prop({ type: String, enum: Object.values(DiscountTypeEnum), required: true })
  type: DiscountTypeEnum;

  @Prop({ type: Number, required: true })
  value: number;

  @Prop({ type: Date })
  startDate?: Date;

  @Prop({ type: Date })
  endDate?: Date;

  @Prop({ type: Number, default: 0 })
  usageLimit?: number;

  @Prop({ type: Number, default: 0 })
  usedCount: number;

  @Prop({ type: Number, default: 0 })
  minOrderAmount?: number;

  @Prop([{ type: Types.ObjectId, ref: 'Product' }])
  applicableProducts?: Types.ObjectId[];

  @Prop([{ type: Types.ObjectId, ref: 'Category' }])
  applicableCategories?: Types.ObjectId[];

  @Prop([{ type: Types.ObjectId, ref: 'Restaurant' }])
  restaurants: Types.ObjectId[];

  @Prop({ type: Boolean, default: true })
  isActive: boolean;
}

export const DiscountSchema = SchemaFactory.createForClass(Discount);
