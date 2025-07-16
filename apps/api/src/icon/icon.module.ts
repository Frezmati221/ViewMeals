import { Module } from "@nestjs/common";
import { IconController } from "./icon.controller";
import { IconLibModule } from "@viewmeals-server/common";

@Module({
  imports: [IconLibModule],
  controllers: [IconController],
})
export class IconModule {}
