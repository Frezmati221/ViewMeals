import { Module } from "@nestjs/common";
import { MediaController } from "./media.controller";
import { MediaService } from "./media.service";
import { MediaLibModule } from "@viewmeals-server/common";

@Module({
  imports: [MediaLibModule],
  controllers: [MediaController],
})
export class MediaModule {}
