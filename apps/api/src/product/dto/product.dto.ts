import {
  IsString,
  IsOptional,
  IsArray,
  IsBoolean,
  IsObject,
  IsNumber,
  IsMongoId,
  ValidateNested,
  Min,
  IsNotEmpty,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { Types } from "mongoose";

export class ProductTranslationDto {
  @ApiProperty({
    example: "Margherita Pizza",
    description: "Product name in the specific language",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: "Classic pizza with tomato sauce, mozzarella and basil",
    description: "Product description in the specific language",
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: "Contains gluten, dairy",
    description: "Allergen information in the specific language",
    required: false,
  })
  @IsOptional()
  @IsString()
  allergens?: string;
}

export class CreateProductDto {
  @ApiProperty({
    example: {
      en: {
        name: "Margherita Pizza",
        description: "Classic pizza with tomato sauce, mozzarella and basil",
        allergens: "Contains gluten, dairy",
      },
      es: {
        name: "Pizza Margarita",
        description: "Pizza clásica con salsa de tomate, mozzarella y albahaca",
        allergens: "Contiene gluten, lácteos",
      },
    },
    description: "Translations for the product in different languages",
  })
  @IsObject()
  @IsNotEmpty()
  translations: Map<string, ProductTranslationDto>;

  @ApiProperty({
    example: ["64f7a1b2c3d4e5f6a7b8c9d0"],
    description: "Array of product type MongoDB ObjectIds",
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  types?: Types.ObjectId[];

  @ApiProperty({
    example: "64f7a1b2c3d4e5f6a7b8c9d0",
    description: "MongoDB ObjectId of the video media",
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  video?: Types.ObjectId;

  @ApiProperty({
    example: "64f7a1b2c3d4e5f6a7b8c9d0",
    description: "MongoDB ObjectId of the image media",
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  image?: Types.ObjectId;

  @ApiProperty({
    example: ["64f7a1b2c3d4e5f6a7b8c9d0", "64f7a1b2c3d4e5f6a7b8c9d1"],
    description: "Array of category MongoDB ObjectIds (required)",
  })
  @IsArray()
  @IsNotEmpty()
  @IsMongoId({ each: true })
  categories: Types.ObjectId[];

  @ApiProperty({
    example: ["64f7a1b2c3d4e5f6a7b8c9d0"],
    description: "Array of subcategory MongoDB ObjectIds",
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  subcategories?: Types.ObjectId[];

  @ApiProperty({
    example: 0,
    description: "Number of likes (automatically set to 0)",
    default: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  likes?: number;

  @ApiProperty({
    example: 12.99,
    description: "Price of the product (required)",
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    example: 350,
    description: "Weight in grams (required)",
  })
  @IsNumber()
  @Min(1)
  grams: number;

  @ApiProperty({
    example: false,
    description: "Whether the product is currently unavailable",
    default: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isStopList?: boolean;

  @ApiProperty({
    example: ["64f7a1b2c3d4e5f6a7b8c9d0"],
    description: "Array of restaurant MongoDB ObjectIds (required)",
  })
  @IsArray()
  @IsNotEmpty()
  @IsMongoId({ each: true })
  restaurants: Types.ObjectId[];
}

export class UpdateProductDto {
  @ApiProperty({
    example: {
      en: {
        name: "Margherita Pizza",
        description: "Classic pizza with tomato sauce, mozzarella and basil",
        allergens: "Contains gluten, dairy",
      },
      es: {
        name: "Pizza Margarita",
        description: "Pizza clásica con salsa de tomate, mozzarella y albahaca",
        allergens: "Contiene gluten, lácteos",
      },
    },
    description: "Translations for the product in different languages",
    required: false,
  })
  @IsOptional()
  @IsObject()
  translations?: Map<string, ProductTranslationDto>;

  @ApiProperty({
    example: ["64f7a1b2c3d4e5f6a7b8c9d0"],
    description: "Array of product type MongoDB ObjectIds",
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  types?: Types.ObjectId[];

  @ApiProperty({
    example: "64f7a1b2c3d4e5f6a7b8c9d0",
    description: "MongoDB ObjectId of the video media",
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  video?: Types.ObjectId;

  @ApiProperty({
    example: "64f7a1b2c3d4e5f6a7b8c9d0",
    description: "MongoDB ObjectId of the image media",
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  image?: Types.ObjectId;

  @ApiProperty({
    example: ["64f7a1b2c3d4e5f6a7b8c9d0", "64f7a1b2c3d4e5f6a7b8c9d1"],
    description: "Array of category MongoDB ObjectIds",
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  categories?: Types.ObjectId[];

  @ApiProperty({
    example: ["64f7a1b2c3d4e5f6a7b8c9d0"],
    description: "Array of subcategory MongoDB ObjectIds",
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  subcategories?: Types.ObjectId[];

  @ApiProperty({
    example: 5,
    description: "Number of likes",
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  likes?: number;

  @ApiProperty({
    example: 12.99,
    description: "Price of the product",
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiProperty({
    example: 350,
    description: "Weight in grams",
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  grams?: number;

  @ApiProperty({
    example: false,
    description: "Whether the product is currently unavailable",
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isStopList?: boolean;

  @ApiProperty({
    example: ["64f7a1b2c3d4e5f6a7b8c9d0"],
    description: "Array of restaurant MongoDB ObjectIds",
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  restaurants?: Types.ObjectId[];
}
