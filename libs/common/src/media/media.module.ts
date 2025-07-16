import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MediaRepository } from "./media.repository";
import { MediaService } from "./media.service";
import { MediaSchema } from "../database";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Media", schema: MediaSchema }]),
  ],
  providers: [MediaRepository, MediaService],
  exports: [MediaService, MediaRepository],
})
export class MediaLibModule {}
