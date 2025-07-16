import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: Types.ObjectId;

  @Prop({
    type: Map,
    of: {
      name: { type: String },
      description: { type: String },
      allergens: { type: String },
    },
    required: true,
  })
  translations: Map<string, {
    name: string;
    description?: string;
    allergens?: string;
  }>;

  @Prop([{ type: Types.ObjectId, ref: 'ProductType' }])
  types?: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'Media' })
  video?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Media' })
  image?: Types.ObjectId;

  @Prop([{ type: Types.ObjectId, ref: 'Category', required: true }])
  categories: Types.ObjectId[];

  @Prop([{ type: Types.ObjectId }])
  subcategories: Types.ObjectId[];

  @Prop({ type: Number, default: 0 })
  likes?: number;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: Number, required: true })
  grams: number;

  @Prop({ type: Boolean, default: false })
  isStopList?: boolean;

  @Prop([{ type: Types.ObjectId, ref: 'Restaurant', required: true }])
  restaurants: Types.ObjectId[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
