import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Order } from "../database";

@Injectable()
export class OrderRepository {
  constructor(@InjectModel("Order") private orderModel: Model<Order>) {}

  async create(orderData: Partial<Order>): Promise<Order> {
    const order = new this.orderModel(orderData);
    return order.save();
  }

  async findById(id: string): Promise<Order | null> {
    return this.orderModel.findById(id).exec();
  }

  async findByIdWithPopulate(id: string): Promise<Order | null> {
    return this.orderModel
      .findById(id)
      .populate("restaurant", "name")
      .populate("items.product", "translations image")
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
  ): Promise<Order[]> {
    let query = this.orderModel.find(filter);

    if (options.populate) {
      query = query
        .populate("restaurant", "name")
        .populate("items.product", "translations image");
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
    return this.orderModel.countDocuments(filter).exec();
  }

  async update(id: string, updateData: Partial<Order>): Promise<Order | null> {
    return this.orderModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Order | null> {
    return this.orderModel.findByIdAndDelete(id).exec();
  }
}
