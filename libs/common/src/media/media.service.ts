import { Injectable, NotFoundException } from "@nestjs/common";
import { MediaRepository } from "./media.repository";
import { Media, User } from "../database";

@Injectable()
export class MediaService {
  constructor(private mediaRepository: MediaRepository) {}

  async create(
    file: Express.Multer.File,
    user: User,
    metadata?: any
  ): Promise<Media> {
    const mediaData = {
      owner:
        typeof user._id === "string"
          ? new (require("mongoose").Types.ObjectId)(user._id)
          : user._id,
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      url: file.path || file.filename,
      type: file.mimetype.startsWith("image/")
        ? "image"
        : file.mimetype.startsWith("video/")
          ? "video"
          : "document",
      metadata,
    };

    return await this.mediaRepository.create(mediaData);
  }

  async findAll(
    query: any,
    user: User
  ): Promise<{
    media: Media[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    const { page = 1, limit = 10, type } = query;
    const skip = (page - 1) * limit;

    const filter: any = { owner: user._id };
    if (type) filter.type = type;

    const media = await this.mediaRepository.findMany(filter, {
      skip,
      limit,
      sort: { createdAt: -1 },
    });

    const total = await this.mediaRepository.countDocuments(filter);

    return {
      media,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, user?: User): Promise<Media> {
    const filter: any = { _id: id };
    if (user) {
      filter.owner = user._id;
    }

    const media = await this.mediaRepository.findOne(filter);
    if (!media) {
      throw new NotFoundException("Media not found");
    }
    return media;
  }

  async remove(id: string, user?: User): Promise<{ message: string }> {
    const filter: any = { _id: id };
    if (user) {
      filter.owner = user._id;
    }

    const media = await this.mediaRepository.findOne(filter);
    if (!media) {
      throw new NotFoundException("Media not found");
    }

    await this.mediaRepository.delete(id);
    return { message: "Media deleted successfully" };
  }
}
