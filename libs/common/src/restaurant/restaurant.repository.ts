import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Restaurant } from "../database";

@Injectable()
export class RestaurantRepository {
  constructor(
    @InjectModel("Restaurant") private restaurantModel: Model<Restaurant>
  ) {}

  async create(restaurantData: Partial<Restaurant>): Promise<Restaurant> {
    const restaurant = new this.restaurantModel(restaurantData);
    return restaurant.save();
  }

  async findById(id: string): Promise<Restaurant | null> {
    return this.restaurantModel.findById(id).exec();
  }

  async findByIdWithPopulate(id: string): Promise<Restaurant | null> {
    return this.restaurantModel
      .findById(id)
      .populate("owner", "name email")
      .exec();
  }

  async findMany(
    filter: any,
    options: {
      skip?: number;
      limit?: number;
      sort?: any;
      populate?: boolean;
    } = {}
  ): Promise<Restaurant[]> {
    let query = this.restaurantModel.find(filter);

    if (options.populate) {
      query = query.populate("owner", "name email");
    }

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
    return this.restaurantModel.countDocuments(filter).exec();
  }

  async update(
    id: string,
    updateData: Partial<Restaurant>
  ): Promise<Restaurant | null> {
    return this.restaurantModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Restaurant | null> {
    return this.restaurantModel.findByIdAndDelete(id).exec();
  }

  async findByUrlPath(urlPath: string): Promise<Restaurant | null> {
    return this.restaurantModel
      .findOne({ restaurantUrlPath: urlPath })
      .populate("owner", "name email")
      .exec();
  }
}
