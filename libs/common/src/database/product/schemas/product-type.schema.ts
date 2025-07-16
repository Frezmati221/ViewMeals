import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class ProductType extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: Types.ObjectId;

  @Prop({
    type: Map,
    of: {
      name: { type: String },
      description: { type: String },
    },
    required: true,
  })
  translations: Map<string, {
    name: string;
    description?: string;
  }>;

  @Prop({ type: Object })
  properties?: any;

  @Prop([{ type: Types.ObjectId, ref: 'Restaurant' }])
  restaurants: Types.ObjectId[];

  @Prop({ type: Boolean, default: true })
  isActive: boolean;
}

export const ProductTypeSchema = SchemaFactory.createForClass(ProductType);
