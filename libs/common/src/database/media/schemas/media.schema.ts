import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Media extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: Types.ObjectId;

  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  originalName: string;

  @Prop({ required: true })
  mimeType: string;

  @Prop({ required: true })
  size: number;

  @Prop({ required: true })
  url: string;

  @Prop()
  cloudinaryPublicId?: string;

  @Prop({ type: String, enum: ['image', 'video', 'document'], required: true })
  type: string;

  @Prop({ type: Object })
  metadata?: any;
}

export const MediaSchema = SchemaFactory.createForClass(Media);
