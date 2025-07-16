import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Category } from "../database";

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectModel("Category") private categoryModel: Model<Category>
  ) {}

  async create(categoryData: Partial<Category>): Promise<Category> {
    const category = new this.categoryModel(categoryData);
    return category.save();
  }

  async findById(id: string): Promise<Category | null> {
    return this.categoryModel.findById(id).exec();
  }

  async findByIdWithPopulate(id: string): Promise<Category | null> {
    return this.categoryModel
      .findById(id)
      .populate("owner", "name email")
      .populate("icon")
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
  ): Promise<Category[]> {
    let query = this.categoryModel.find(filter);

    if (options.populate) {
      query = query.populate("owner", "name email").populate("icon");
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

  async findByRestaurant(restaurantId: string): Promise<Category[]> {
    return this.categoryModel
      .find({ restaurants: restaurantId })
      .populate("icon")
      .sort({ createdAt: -1 })
      .exec();
  }

  async countDocuments(filter: any): Promise<number> {
    return this.categoryModel.countDocuments(filter).exec();
  }

  async update(
    id: string,
    updateData: Partial<Category>
  ): Promise<Category | null> {
    return this.categoryModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Category | null> {
    return this.categoryModel.findByIdAndDelete(id).exec();
  }
}
