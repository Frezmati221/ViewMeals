import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { RestaurantModule } from "./restaurant/restaurant.module";
import { CategoryModule } from "./category/category.module";
import { ProductModule } from "./product/product.module";
import { OrderModule } from "./order/order.module";
import { MediaModule } from "./media/media.module";
import { IconModule } from "./icon/icon.module";
import { PlanModule } from "./plan/plan.module";
import { StripeModule } from "./stripe/stripe.module";
import { ViewmealsConfigModule } from "@viewmeals-server/common";
import swaggerConfig from "../config/swagger.config";
import appConfig from "../config/app.config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, swaggerConfig],
      envFilePath: [".env"],
    }),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    AuthModule,
    UserModule,
    RestaurantModule,
    CategoryModule,
    ProductModule,
    OrderModule,
    MediaModule,
    IconModule,
    PlanModule,
    StripeModule,
    ViewmealsConfigModule,
  ],
})
export class AppModule {}
