import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Product } from "../database";

@Injectable()
export class ProductRepository {
  constructor(@InjectModel("Product") private productModel: Model<Product>) {}

  async create(productData: Partial<Product>): Promise<Product> {
    const product = new this.productModel(productData);
    return product.save();
  }

  async findById(id: string): Promise<Product | null> {
    return this.productModel.findById(id).exec();
  }

  async findByIdWithPopulate(id: string): Promise<Product | null> {
    return this.productModel
      .findById(id)
      .populate("owner", "name email")
      .populate("categories", "translations")
      .populate("image")
      .populate("video")
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
  ): Promise<Product[]> {
    let query = this.productModel.find(filter);

    if (options.populate) {
      query = query
        .populate("owner", "name email")
        .populate("categories", "translations")
        .populate("image")
        .populate("video");
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

  async findByRestaurant(restaurantId: string): Promise<Product[]> {
    return this.productModel
      .find({ restaurants: restaurantId })
      .populate("categories", "translations")
      .populate("image")
      .populate("video")
      .sort({ createdAt: -1 })
      .exec();
  }

  async countDocuments(filter: any): Promise<number> {
    return this.productModel.countDocuments(filter).exec();
  }

  async update(
    id: string,
    updateData: Partial<Product>
  ): Promise<Product | null> {
    return this.productModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async updateStopList(
    id: string,
    isStopList: boolean
  ): Promise<Product | null> {
    return this.productModel
      .findByIdAndUpdate(id, { isStopList }, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Product | null> {
    return this.productModel.findByIdAndDelete(id).exec();
  }
}
