import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { ProductRepository } from "./product.repository";
import { Product, User, UserRoleEnum } from "../database";

@Injectable()
export class ProductService {
  constructor(private productRepository: ProductRepository) {}

  async create(createProductDto: any, user: User): Promise<Product> {
    const productData = {
      ...createProductDto,
      owner: user._id,
    };
    return await this.productRepository.create(productData);
  }

  async findAll(
    query: any,
    user?: User
  ): Promise<{
    products: Product[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    const { page = 1, limit = 10, search, category, restaurant } = query;
    const skip = (page - 1) * limit;

    const filter: any = {};

    if (user && user.role !== UserRoleEnum.SuperAdmin) {
      filter.owner = user._id;
    }

    if (category) filter.categories = category;
    if (restaurant) filter.restaurants = restaurant;
    if (search) {
      filter["translations.name"] = { $regex: search, $options: "i" };
    }

    const products = await this.productRepository.findMany(filter, {
      skip,
      limit,
      sort: { createdAt: -1 },
      populate: true,
    });

    const total = await this.productRepository.countDocuments(filter);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, user?: User): Promise<Product> {
    const product = await this.productRepository.findByIdWithPopulate(id);

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    if (user && !this.hasAccess(user, product.owner.toString())) {
      throw new ForbiddenException("Access denied");
    }

    return product;
  }

  async update(
    id: string,
    updateProductDto: any,
    user: User
  ): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException("Product not found");
    }

    if (!this.hasAccess(user, product.owner.toString())) {
      throw new ForbiddenException("Access denied");
    }

    const updatedProduct = await this.productRepository.update(
      id,
      updateProductDto
    );
    return updatedProduct!;
  }

  async remove(id: string, user: User): Promise<{ message: string }> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException("Product not found");
    }

    if (!this.hasAccess(user, product.owner.toString())) {
      throw new ForbiddenException("Access denied");
    }

    await this.productRepository.delete(id);
    return { message: "Product deleted successfully" };
  }

  async findByRestaurant(restaurantId: string): Promise<Product[]> {
    return await this.productRepository.findByRestaurant(restaurantId);
  }

  async updateStopList(
    id: string,
    isStopList: boolean,
    user: User
  ): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException("Product not found");
    }

    if (!this.hasAccess(user, product.owner.toString())) {
      throw new ForbiddenException("Access denied");
    }

    const updatedProduct = await this.productRepository.updateStopList(
      id,
      isStopList
    );
    return updatedProduct!;
  }

  private hasAccess(user: User, ownerId: string): boolean {
    return (
      user.role === UserRoleEnum.SuperAdmin || user._id.toString() === ownerId
    );
  }
}
