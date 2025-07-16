import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { IconRepository } from "./icon.repository";
import { IconService } from "./icon.service";
import { IconSchema } from "../database";

@Module({
  imports: [MongooseModule.forFeature([{ name: "Icon", schema: IconSchema }])],
  providers: [IconRepository, IconService],
  exports: [IconService, IconRepository],
})
export class IconLibModule {}
