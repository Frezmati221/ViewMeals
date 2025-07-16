import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { RestaurantRepository } from "./restaurant.repository";
import { RestaurantService } from "./restaurant.service";
import { RestaurantSchema } from "../database";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: "Restaurant", schema: RestaurantSchema },
    ]),
  ],
  providers: [RestaurantRepository, RestaurantService],
  exports: [RestaurantService, RestaurantRepository],
})
export class RestaurantLibModule {}
