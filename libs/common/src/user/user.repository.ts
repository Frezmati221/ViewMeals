import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "../database";

@Injectable()
export class UserRepository {
  constructor(@InjectModel("User") private userModel: Model<User>) {}

  async findById(userId: string, selectFields?: string): Promise<User | null> {
    let query = this.userModel.findById(userId);
    if (selectFields) {
      query = query.select(selectFields);
    }
    return query.exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = new this.userModel(userData);
    return user.save();
  }

  async update(
    userId: string,
    updateData: Partial<User>
  ): Promise<User | null> {
    return this.userModel
      .findByIdAndUpdate(userId, updateData, { new: true })
      .exec();
  }

  async delete(userId: string): Promise<User | null> {
    return this.userModel.findByIdAndDelete(userId).exec();
  }

  async findMany(
    filter: any,
    options: {
      skip?: number;
      limit?: number;
      sort?: any;
      select?: string;
    } = {}
  ): Promise<User[]> {
    let query = this.userModel.find(filter);

    if (options.select) {
      query = query.select(options.select);
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
    return this.userModel.countDocuments(filter).exec();
  }
}
