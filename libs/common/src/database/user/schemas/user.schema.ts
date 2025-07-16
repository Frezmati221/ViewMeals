import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum UserRoleEnum {
  SuperAdmin = 'superadmin',
  RestaurantAdmin = 'restaurantAdmin',
}

export interface StripeFields {
  customerId?: string;
  subscriptionId?: string;
  subscriptionStatus?: string;
  planId?: string;
  [key: string]: any;
}

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ 
    type: String, 
    enum: Object.values(UserRoleEnum), 
    required: true 
  })
  role: UserRoleEnum;

  @Prop({ type: Object })
  stripe?: StripeFields;
}

export const UserSchema = SchemaFactory.createForClass(User);
