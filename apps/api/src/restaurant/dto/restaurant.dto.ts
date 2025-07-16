import {
  IsString,
  IsOptional,
  IsArray,
  IsBoolean,
  IsObject,
  IsEnum,
  IsMongoId,
  ValidateNested,
  IsUrl,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { Types } from "mongoose";
import { ResSocialLinksEnum, SlideLinkEnum } from "@viewmeals-server/common";

export class SlideDto {
  @ApiProperty({
    example: "64f7a1b2c3d4e5f6a7b8c9d0",
    description: "MongoDB ObjectId of the media image",
  })
  @IsMongoId()
  image: Types.ObjectId;

  @ApiProperty({
    example: "https://example.com",
    description: "URL link for the slide",
  })
  @IsUrl()
  url: string;

  @ApiProperty({
    example: "external",
    enum: SlideLinkEnum,
    description: "Type of link: external or internalParams",
  })
  @IsEnum(SlideLinkEnum)
  type: SlideLinkEnum;
}

export class SocialLinkDto {
  @ApiProperty({
    example: "instagram",
    enum: ResSocialLinksEnum,
    description: "Type of social media platform",
  })
  @IsEnum(ResSocialLinksEnum)
  type: ResSocialLinksEnum;

  @ApiProperty({
    example: "https://instagram.com/myrestaurant",
    description: "URL link to the social media profile",
  })
  @IsUrl()
  link: string;
}

export class CreateRestaurantDto {
  @ApiProperty({
    example: "My Restaurant",
    description: "Name of the restaurant",
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: ["en", "es"],
    description: "Array of supported language codes",
    required: false,
  })
  @IsArray()
  @IsOptional()
  langs?: string[];

  @ApiProperty({
    example: "my-amazing-restaurant",
    description: "Unique URL path for the restaurant",
    required: false,
  })
  @IsOptional()
  @IsString()
  restaurantUrlPath?: string;

  @ApiProperty({
    example: "My Amazing Restaurant",
    description: "Display name of the restaurant",
    required: false,
  })
  @IsOptional()
  @IsString()
  restaurantName?: string;

  @ApiProperty({
    type: [SlideDto],
    example: [
      {
        image: "64f7a1b2c3d4e5f6a7b8c9d0",
        url: "https://example.com",
        type: "external",
      },
    ],
    description: "Array of slide objects for restaurant carousel",
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SlideDto)
  slides?: SlideDto[];

  @ApiProperty({
    example: {},
    description: "Stripe configuration object",
    required: false,
  })
  @IsOptional()
  @IsObject()
  stripe?: any;

  @ApiProperty({
    type: [SocialLinkDto],
    example: [
      {
        type: "instagram",
        link: "https://instagram.com/myrestaurant",
      },
      {
        type: "website",
        link: "https://myrestaurant.com",
      },
    ],
    description: "Array of social media links",
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SocialLinkDto)
  socialLinks?: SocialLinkDto[];

  @ApiProperty({
    example: {},
    description: "Subscription details",
    required: false,
  })
  @IsOptional()
  @IsObject()
  subscription?: any;

  @ApiProperty({
    example: {
      phone: "+1234567890",
      email: "contact@restaurant.com",
    },
    description: "Contact information",
    required: false,
  })
  @IsOptional()
  @IsObject()
  contact?: any;

  @ApiProperty({
    example: {
      address: "123 Main St, City, Country",
      coordinates: { lat: 40.7128, lng: -74.006 },
    },
    description: "Location details",
    required: false,
  })
  @IsOptional()
  @IsObject()
  location?: any;

  @ApiProperty({
    example: {
      monday: "9:00-22:00",
      tuesday: "9:00-22:00",
      wednesday: "9:00-22:00",
      thursday: "9:00-22:00",
      friday: "9:00-23:00",
      saturday: "10:00-23:00",
      sunday: "10:00-21:00",
    },
    description: "Working hours schedule",
    required: false,
  })
  @IsOptional()
  @IsObject()
  workingHours?: any;

  @ApiProperty({
    example: {
      primary: "#ff6b35",
      secondary: "#f7931e",
      accent: "#2e8b57",
    },
    description: "Color scheme configuration",
    required: false,
  })
  @IsOptional()
  @IsObject()
  colors?: any;

  @ApiProperty({
    example: {
      primary: "Roboto",
      secondary: "Open Sans",
    },
    description: "Font configuration",
    required: false,
  })
  @IsOptional()
  @IsObject()
  fonts?: any;

  @ApiProperty({
    example: {
      style: "modern",
      layout: "grid",
    },
    description: "Theme configuration",
    required: false,
  })
  @IsOptional()
  @IsObject()
  theme?: any;

  @ApiProperty({
    example: true,
    description: "Whether the restaurant is active",
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateRestaurantDto {
  @ApiProperty({
    example: "My Restaurant",
    description: "Name of the restaurant",
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: ["en", "es"],
    description: "Array of supported language codes",
    required: false,
  })
  @IsOptional()
  @IsArray()
  langs?: string[];

  @ApiProperty({
    example: "my-amazing-restaurant",
    description: "Unique URL path for the restaurant",
    required: false,
  })
  @IsOptional()
  @IsString()
  restaurantUrlPath?: string;

  @ApiProperty({
    example: "My Amazing Restaurant",
    description: "Display name of the restaurant",
    required: false,
  })
  @IsOptional()
  @IsString()
  restaurantName?: string;

  @ApiProperty({
    type: [SlideDto],
    example: [
      {
        image: "64f7a1b2c3d4e5f6a7b8c9d0",
        url: "https://example.com",
        type: "external",
      },
    ],
    description: "Array of slide objects for restaurant carousel",
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SlideDto)
  slides?: SlideDto[];

  @ApiProperty({
    example: {},
    description: "Stripe configuration object",
    required: false,
  })
  @IsOptional()
  @IsObject()
  stripe?: any;

  @ApiProperty({
    type: [SocialLinkDto],
    example: [
      {
        type: "instagram",
        link: "https://instagram.com/myrestaurant",
      },
      {
        type: "website",
        link: "https://myrestaurant.com",
      },
    ],
    description: "Array of social media links",
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SocialLinkDto)
  socialLinks?: SocialLinkDto[];

  @ApiProperty({
    example: {},
    description: "Subscription details",
    required: false,
  })
  @IsOptional()
  @IsObject()
  subscription?: any;

  @ApiProperty({
    example: {
      phone: "+1234567890",
      email: "contact@restaurant.com",
    },
    description: "Contact information",
    required: false,
  })
  @IsOptional()
  @IsObject()
  contact?: any;

  @ApiProperty({
    example: {
      address: "123 Main St, City, Country",
      coordinates: { lat: 40.7128, lng: -74.006 },
    },
    description: "Location details",
    required: false,
  })
  @IsOptional()
  @IsObject()
  location?: any;

  @ApiProperty({
    example: {
      monday: "9:00-22:00",
      tuesday: "9:00-22:00",
      wednesday: "9:00-22:00",
      thursday: "9:00-22:00",
      friday: "9:00-23:00",
      saturday: "10:00-23:00",
      sunday: "10:00-21:00",
    },
    description: "Working hours schedule",
    required: false,
  })
  @IsOptional()
  @IsObject()
  workingHours?: any;

  @ApiProperty({
    example: {
      primary: "#ff6b35",
      secondary: "#f7931e",
      accent: "#2e8b57",
    },
    description: "Color scheme configuration",
    required: false,
  })
  @IsOptional()
  @IsObject()
  colors?: any;

  @ApiProperty({
    example: {
      primary: "Roboto",
      secondary: "Open Sans",
    },
    description: "Font configuration",
    required: false,
  })
  @IsOptional()
  @IsObject()
  fonts?: any;

  @ApiProperty({
    example: {
      style: "modern",
      layout: "grid",
    },
    description: "Theme configuration",
    required: false,
  })
  @IsOptional()
  @IsObject()
  theme?: any;

  @ApiProperty({
    example: true,
    description: "Whether the restaurant is active",
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
