import { Module } from "@nestjs/common";
import { RestaurantController } from "./restaurant.controller";
import { RestaurantService } from "./restaurant.service";
import { RestaurantLibModule } from "@viewmeals-server/common";

@Module({
  imports: [RestaurantLibModule],
  controllers: [RestaurantController],
})
export class RestaurantModule {}
