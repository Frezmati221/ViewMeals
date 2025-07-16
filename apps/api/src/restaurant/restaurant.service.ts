import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { CreateRestaurantDto, UpdateRestaurantDto } from "./dto/restaurant.dto";
import { Restaurant, User, UserRoleEnum } from "@viewmeals-server/common";

@Injectable()
export class RestaurantService {
  constructor(
    @InjectModel("Restaurant") private restaurantModel: Model<Restaurant>
  ) {}

  async create(createRestaurantDto: CreateRestaurantDto, user: User) {
    const restaurant = new this.restaurantModel({
      ...createRestaurantDto,
      owner: user._id,
    });

    return await restaurant.save();
  }

  async findAll(query: any, user: User) {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const filter: any = {};

    // If not super admin, only show own restaurants
    if (user.role !== UserRoleEnum.SuperAdmin) {
      filter.owner = user._id;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { restaurantName: { $regex: search, $options: "i" } },
      ];
    }

    const restaurants = await this.restaurantModel
      .find(filter)
      .populate("owner", "name email")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await this.restaurantModel.countDocuments(filter);

    return {
      restaurants,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, user: User) {
    const restaurant = await this.restaurantModel
      .findById(id)
      .populate("owner", "name email");

    if (!restaurant) {
      throw new NotFoundException("Restaurant not found");
    }

    // Check access rights
    if (!this.hasAccess(user, restaurant.owner.toString())) {
      throw new ForbiddenException("Access denied");
    }

    return restaurant;
  }

  async update(
    id: string,
    updateRestaurantDto: UpdateRestaurantDto,
    user: User
  ) {
    const restaurant = await this.restaurantModel.findById(id);

    if (!restaurant) {
      throw new NotFoundException("Restaurant not found");
    }

    // Check access rights
    if (!this.hasAccess(user, restaurant.owner.toString())) {
      throw new ForbiddenException("Access denied");
    }

    Object.assign(restaurant, updateRestaurantDto);
    return await restaurant.save();
  }

  async remove(id: string, user: User) {
    const restaurant = await this.restaurantModel.findById(id);

    if (!restaurant) {
      throw new NotFoundException("Restaurant not found");
    }

    // Check access rights
    if (!this.hasAccess(user, restaurant.owner.toString())) {
      throw new ForbiddenException("Access denied");
    }

    await this.restaurantModel.findByIdAndDelete(id);
    return { message: "Restaurant deleted successfully" };
  }

  async findByUrlPath(urlPath: string) {
    const restaurant = await this.restaurantModel
      .findOne({ restaurantUrlPath: urlPath })
      .populate("owner", "name email");

    if (!restaurant) {
      throw new NotFoundException("Restaurant not found");
    }

    return restaurant;
  }

  private hasAccess(user: User, ownerId: string): boolean {
    return (
      user.role === UserRoleEnum.SuperAdmin || user._id.toString() === ownerId
    );
  }
}
