import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Icon } from "../database";

@Injectable()
export class IconRepository {
  constructor(@InjectModel("Icon") private iconModel: Model<Icon>) {}

  async create(iconData: Partial<Icon>): Promise<Icon> {
    const icon = new this.iconModel(iconData);
    return icon.save();
  }

  async findById(id: string): Promise<Icon | null> {
    return this.iconModel.findById(id).exec();
  }

  async findMany(
    filter: any,
    options: {
      skip?: number;
      limit?: number;
      sort?: any;
    } = {}
  ): Promise<Icon[]> {
    let query = this.iconModel.find(filter);

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
    return this.iconModel.countDocuments(filter).exec();
  }

  async update(id: string, updateData: Partial<Icon>): Promise<Icon | null> {
    return this.iconModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async findByLabel(label: string, excludeId?: string): Promise<Icon | null> {
    const filter: any = { label };
    if (excludeId) {
      filter._id = { $ne: excludeId };
    }
    return this.iconModel.findOne(filter).exec();
  }

  async delete(id: string): Promise<Icon | null> {
    return this.iconModel.findByIdAndDelete(id).exec();
  }
}
