import { Injectable, NotFoundException } from "@nestjs/common";
import { OrderRepository } from "./order.repository";
import { Order } from "../database";

@Injectable()
export class OrderService {
  constructor(private orderRepository: OrderRepository) {}

  async create(createOrderDto: any): Promise<Order> {
    return await this.orderRepository.create(createOrderDto);
  }

  async findAll(query: any): Promise<{
    orders: Order[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    const { page = 1, limit = 10, restaurant, status } = query;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (restaurant) filter.restaurant = restaurant;
    if (status) filter.status = status;

    const orders = await this.orderRepository.findMany(filter, {
      skip,
      limit,
      sort: { createdAt: -1 },
      populate: true,
    });

    const total = await this.orderRepository.countDocuments(filter);

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

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findByIdWithPopulate(id);
    if (!order) {
      throw new NotFoundException("Order not found");
    }
    return order;
  }

  async update(id: string, updateOrderDto: any): Promise<Order> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundException("Order not found");
    }

    const updatedOrder = await this.orderRepository.update(id, updateOrderDto);
    return updatedOrder!;
  }

  async updateStatus(id: string, status: string): Promise<Order | null> {
    return await this.orderRepository.update(id, { status });
  }
}
