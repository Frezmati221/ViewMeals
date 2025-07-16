import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CategoryRepository } from "./category.repository";
import { CategoryService } from "./category.service";
import { CategorySchema } from "../database";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Category", schema: CategorySchema }]),
  ],
  providers: [CategoryRepository, CategoryService],
  exports: [CategoryService, CategoryRepository],
})
export class CategoryLibModule {}
