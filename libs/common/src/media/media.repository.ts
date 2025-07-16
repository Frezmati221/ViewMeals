import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Media } from "../database";

@Injectable()
export class MediaRepository {
  constructor(@InjectModel("Media") private mediaModel: Model<Media>) {}

  async create(mediaData: Partial<Media>): Promise<Media> {
    const media = new this.mediaModel(mediaData);
    return media.save();
  }

  async findById(id: string): Promise<Media | null> {
    return this.mediaModel.findById(id).exec();
  }

  async findOne(filter: any): Promise<Media | null> {
    return this.mediaModel.findOne(filter).exec();
  }

  async findMany(
    filter: any,
    options: {
      skip?: number;
      limit?: number;
      sort?: any;
    } = {}
  ): Promise<Media[]> {
    let query = this.mediaModel.find(filter);

    if (options.skip) {
      query = query.skip(options.skip);
    }
    if (options.limit) {
      query = query.limit(options.limit);
    }
    if (options.sort) {
      query = query.sort(options.sort);
    }

    return query.exec();
  }

  async countDocuments(filter: any): Promise<number> {
    return this.mediaModel.countDocuments(filter).exec();
  }

  async delete(id: string): Promise<Media | null> {
    return this.mediaModel.findByIdAndDelete(id).exec();
  }
}
