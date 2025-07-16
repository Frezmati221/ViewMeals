import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Restaurant', required: true })
  restaurant: Types.ObjectId;

  @Prop({ type: String, required: true })
  customerName: string;

  @Prop({ type: String, required: true })
  customerEmail: string;

  @Prop({ type: String })
  customerPhone?: string;

  @Prop([{
    product: { type: Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  }])
  items: {
    product: Types.ObjectId;
    quantity: number;
    price: number;
  }[];

  @Prop({ type: Number, required: true })
  totalAmount: number;

  @Prop({ type: String, required: true })
  currency: string;

  @Prop({ type: String, enum: ['pending', 'paid', 'cancelled'], default: 'pending' })
  status: string;

  @Prop({ type: String })
  stripePaymentIntentId?: string;

  @Prop({ type: Object })
  deliveryAddress?: any;

  @Prop({ type: String })
  notes?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
