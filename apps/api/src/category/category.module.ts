import { Module } from "@nestjs/common";
import { CategoryController } from "./category.controller";
import { CategoryService } from "./category.service";
import { CategoryLibModule } from "@viewmeals-server/common";

@Module({
  imports: [CategoryLibModule],
  controllers: [CategoryController],
})
export class CategoryModule {}
