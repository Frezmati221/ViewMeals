import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Order } from "@viewmeals-server/common";

@Injectable()
export class OrderService {
  constructor(@InjectModel("Order") private orderModel: Model<Order>) {}

  async create(createOrderDto: any) {
    const order = new this.orderModel(createOrderDto);
    return await order.save();
  }

  async findAll(query: any) {
    const { page = 1, limit = 10, restaurant, status } = query;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (restaurant) filter.restaurant = restaurant;
    if (status) filter.status = status;

    const orders = await this.orderModel
      .find(filter)
      .populate("restaurant", "name")
      .populate("items.product", "translations image")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await this.orderModel.countDocuments(filter);

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    return await this.orderModel
      .findById(id)
      .populate("restaurant", "name")
      .populate("items.product", "translations image");
  }

  async updateStatus(id: string, status: string) {
    return await this.orderModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
  }
}
