import { Module } from "@nestjs/common";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";
import { OrderLibModule } from "@viewmeals-server/common";

@Module({
  imports: [OrderLibModule],
  controllers: [OrderController],
})
export class OrderModule {}
