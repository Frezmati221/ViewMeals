import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { StripeController } from "./stripe.controller";
import { StripeService } from "./stripe.service";
import {
  PlanSchema,
  RestaurantSchema,
  StripeLibModule,
} from "@viewmeals-server/common";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: "Restaurant", schema: RestaurantSchema },
      { name: "Plan", schema: PlanSchema },
    ]),
    StripeLibModule,
  ],
  controllers: [StripeController],
  providers: [StripeService],
})
export class StripeModule {}
