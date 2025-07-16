import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum ResSocialLinksEnum {
  Instagram = 'instagram',
  TikTok = 'tiktok',
  GoogleMaps = 'googlemaps',
  Website = 'website',
}

export enum SlideLinkEnum {
  external = 'external',
  internalParams = 'internalParams',
}

export enum SubscriptionStatusEnum {
  Active = 'active',
  Inactive = 'inactive',
  Cancelled = 'cancelled',
  PastDue = 'past_due',
}

@Schema({ timestamps: true })
export class Restaurant extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ type: [String], default: ['en'] })
  langs: string[];

  @Prop({
    type: [{
      image: { type: Types.ObjectId, ref: 'Media' },
      url: String,
      type: { type: String, enum: Object.values(SlideLinkEnum) },
    }],
  })
  slides: {
    image: Types.ObjectId;
    url: string;
    type: SlideLinkEnum;
  }[];

  @Prop()
  restaurantUrlPath?: string;

  @Prop()
  restaurantName?: string;

  @Prop({ type: Object })
  stripe?: any;

  @Prop({
    type: [{
      type: { type: String, enum: Object.values(ResSocialLinksEnum) },
      link: String,
    }],
  })
  socialLinks?: {
    type: ResSocialLinksEnum;
    link: string;
  }[];

  @Prop({
    type: {
      planId: { type: Types.ObjectId, ref: 'Plan' },
      stripeSubscriptionId: String,
      stripeCustomerId: String,
      status: { type: String, enum: Object.values(SubscriptionStatusEnum) },
      firstActivationPaid: { type: Boolean, default: false },
      invoices: [{
        date: Date,
        amount: Number,
        currency: String,
        description: String,
        invoiceUrl: String,
      }],
      currentFreeShootings: { type: Number, default: 0 },
    },
  })
  subscription?: {
    planId: Types.ObjectId;
    stripeSubscriptionId?: string;
    stripeCustomerId?: string;
    status: SubscriptionStatusEnum;
    firstActivationPaid: boolean;
    invoices: {
      date: Date;
      amount: number;
      currency: string;
      description?: string;
      invoiceUrl?: string;
    }[];
    currentFreeShootings: number;
  };

  @Prop({ type: Object })
  contact?: any;

  @Prop({ type: Object })
  location?: any;

  @Prop({ type: Object })
  workingHours?: any;

  @Prop({ type: Object })
  colors?: any;

  @Prop({ type: Object })
  fonts?: any;

  @Prop({ type: Object })
  theme?: any;

  @Prop({ default: true })
  isActive: boolean;
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
