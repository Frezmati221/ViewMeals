import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { RestaurantRepository } from "./restaurant.repository";
import { Restaurant, User, UserRoleEnum } from "../database";

@Injectable()
export class RestaurantService {
  constructor(private restaurantRepository: RestaurantRepository) {}

  async create(createRestaurantDto: any, user: User): Promise<Restaurant> {
    const restaurantData = {
      ...createRestaurantDto,
      owner: user._id,
    };
    return await this.restaurantRepository.create(restaurantData);
  }

  async findAll(
    query: any,
    user: User
  ): Promise<{
    restaurants: Restaurant[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
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

    const restaurants = await this.restaurantRepository.findMany(filter, {
      skip,
      limit,
      sort: { createdAt: -1 },
      populate: true,
    });

    const total = await this.restaurantRepository.countDocuments(filter);

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

  async findOne(id: string, user?: User): Promise<Restaurant> {
    const restaurant = await this.restaurantRepository.findByIdWithPopulate(id);

    if (!restaurant) {
      throw new NotFoundException("Restaurant not found");
    }

    // Check access rights if user is provided
    if (user && !this.hasAccess(user, restaurant.owner.toString())) {
      throw new ForbiddenException("Access denied");
    }

    return restaurant;
  }

  async update(
    id: string,
    updateRestaurantDto: any,
    user: User
  ): Promise<Restaurant> {
    const restaurant = await this.restaurantRepository.findById(id);

    if (!restaurant) {
      throw new NotFoundException("Restaurant not found");
    }

    // Check access rights
    if (!this.hasAccess(user, restaurant.owner.toString())) {
      throw new ForbiddenException("Access denied");
    }

    const updatedRestaurant = await this.restaurantRepository.update(
      id,
      updateRestaurantDto
    );
    return updatedRestaurant!;
  }

  async remove(id: string, user: User): Promise<{ message: string }> {
    const restaurant = await this.restaurantRepository.findById(id);

    if (!restaurant) {
      throw new NotFoundException("Restaurant not found");
    }

    // Check access rights
    if (!this.hasAccess(user, restaurant.owner.toString())) {
      throw new ForbiddenException("Access denied");
    }

    await this.restaurantRepository.delete(id);
    return { message: "Restaurant deleted successfully" };
  }

  async findByUrlPath(urlPath: string): Promise<Restaurant> {
    const restaurant = await this.restaurantRepository.findByUrlPath(urlPath);
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
