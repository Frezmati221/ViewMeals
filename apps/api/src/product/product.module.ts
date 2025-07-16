import { Module } from "@nestjs/common";
import { ProductController } from "./product.controller";
import { ProductLibModule } from "@viewmeals-server/common";

@Module({
  imports: [ProductLibModule],
  controllers: [ProductController],
})
export class ProductModule {}
