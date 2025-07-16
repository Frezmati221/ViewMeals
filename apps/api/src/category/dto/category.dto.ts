import {
  IsString,
  IsOptional,
  IsArray,
  IsObject,
  IsMongoId,
  ValidateNested,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { Types } from "mongoose";

export class TranslationDto {
  @ApiProperty({
    example: "Appetizers",
    description: "Name in the specific language",
  })
  @IsString()
  name: string;
}

export class SubcategoryDto {
  @ApiProperty({
    example: "64f7a1b2c3d4e5f6a7b8c9d0",
    description: "MongoDB ObjectId of the subcategory",
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  _id?: Types.ObjectId;

  @ApiProperty({
    example: {
      en: { name: "Hot Appetizers" },
      es: { name: "Aperitivos Calientes" },
    },
    description: "Translations for the subcategory name in different languages",
  })
  @IsObject()
  translations: Map<string, { name: string }>;
}

export class CreateCategoryDto {
  @ApiProperty({
    example: "64f7a1b2c3d4e5f6a7b8c9d0",
    description: "MongoDB ObjectId of the icon to use for this category",
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  icon?: Types.ObjectId;

  @ApiProperty({
    example: {
      en: { name: "Appetizers" },
      es: { name: "Aperitivos" },
    },
    description: "Translations for the category name in different languages",
  })
  @IsObject()
  translations: Map<string, { name: string }>;

  @ApiProperty({
    type: [SubcategoryDto],
    example: [
      {
        _id: "64f7a1b2c3d4e5f6a7b8c9d1",
        translations: {
          en: { name: "Hot Appetizers" },
          es: { name: "Aperitivos Calientes" },
        },
      },
    ],
    description: "Array of subcategories",
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubcategoryDto)
  subcategories?: SubcategoryDto[];

  @ApiProperty({
    example: ["64f7a1b2c3d4e5f6a7b8c9d0", "64f7a1b2c3d4e5f6a7b8c9d1"],
    description:
      "Array of restaurant MongoDB ObjectIds that this category belongs to",
    required: false,
  })
  @IsOptional()
  @IsArray()
  restaurants?: Types.ObjectId[];
}

export class UpdateCategoryDto {
  @ApiProperty({
    example: "64f7a1b2c3d4e5f6a7b8c9d0",
    description: "MongoDB ObjectId of the icon to use for this category",
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  icon?: Types.ObjectId;

  @ApiProperty({
    example: {
      en: { name: "Appetizers" },
      es: { name: "Aperitivos" },
    },
    description: "Translations for the category name in different languages",
    required: false,
  })
  @IsOptional()
  @IsObject()
  translations?: Map<string, { name: string }>;

  @ApiProperty({
    type: [SubcategoryDto],
    example: [
      {
        _id: "64f7a1b2c3d4e5f6a7b8c9d1",
        translations: {
          en: { name: "Hot Appetizers" },
          es: { name: "Aperitivos Calientes" },
        },
      },
    ],
    description: "Array of subcategories",
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubcategoryDto)
  subcategories?: SubcategoryDto[];

  @ApiProperty({
    example: ["64f7a1b2c3d4e5f6a7b8c9d0", "64f7a1b2c3d4e5f6a7b8c9d1"],
    description:
      "Array of restaurant MongoDB ObjectIds that this category belongs to",
    required: false,
  })
  @IsOptional()
  @IsArray()
  restaurants?: Types.ObjectId[];
}
