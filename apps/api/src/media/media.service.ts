import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Media, User } from "@viewmeals-server/common";
import { Model } from "mongoose";

@Injectable()
export class MediaService {
  constructor(@InjectModel("Media") private mediaModel: Model<Media>) {}

  async create(file: Express.Multer.File, user: User, metadata?: any) {
    const media = new this.mediaModel({
      owner: user._id,
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
    });

    return await media.save();
  }

  async findAll(query: any, user: User) {
    const { page = 1, limit = 10, type } = query;
    const skip = (page - 1) * limit;

    const filter: any = { owner: user._id };
    if (type) filter.type = type;

    const media = await this.mediaModel
      .find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await this.mediaModel.countDocuments(filter);

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

  async findOne(id: string, user: User) {
    const media = await this.mediaModel.findOne({ _id: id, owner: user._id });
    if (!media) {
      throw new NotFoundException("Media not found");
    }
    return media;
  }

  async remove(id: string, user: User) {
    const media = await this.mediaModel.findOne({ _id: id, owner: user._id });
    if (!media) {
      throw new NotFoundException("Media not found");
    }

    await this.mediaModel.findByIdAndDelete(id);
    return { message: "Media deleted successfully" };
  }
}
