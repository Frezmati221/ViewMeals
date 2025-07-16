import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class Icon extends Document {
  @Prop({ required: true })
  label: string;

  @Prop({ required: true })
  svg: string;
}

export const IconSchema = SchemaFactory.createForClass(Icon);
