import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export interface Subcategory {
  _id: Types.ObjectId;
  translations: Map<string, { name: string }>;
}

@Schema({ timestamps: true })
export class Category extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Icon' })
  icon: Types.ObjectId;

  @Prop({
    type: Map,
    of: {
      name: { type: String },
    },
    required: true,
  })
  translations: Map<string, { name: string }>;

  @Prop([{
    _id: { type: Types.ObjectId, auto: true },
    translations: {
      type: Map,
      of: {
        name: { type: String },
      },
    },
  }])
  subcategories: Subcategory[];

  @Prop([{ type: Types.ObjectId, ref: 'Restaurant' }])
  restaurants: Types.ObjectId[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);
