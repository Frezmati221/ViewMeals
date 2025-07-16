import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Product, User, UserRoleEnum } from "@viewmeals-server/common";
import { Model } from "mongoose";

@Injectable()
export class ProductService {
  constructor(@InjectModel("Product") private productModel: Model<Product>) {}

  async create(createProductDto: any, user: User) {
    const product = new this.productModel({
      ...createProductDto,
      owner: user._id,
    });
    return await product.save();
  }

  async findAll(query: any, user?: User) {
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

    const products = await this.productModel
      .find(filter)
      .populate("owner", "name email")
      .populate("categories", "translations")
      .populate("image")
      .populate("video")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await this.productModel.countDocuments(filter);

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

  async findOne(id: string, user?: User) {
    const product = await this.productModel
      .findById(id)
      .populate("owner", "name email")
      .populate("categories", "translations")
      .populate("image")
      .populate("video");

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    if (user && !this.hasAccess(user, product.owner.toString())) {
      throw new ForbiddenException("Access denied");
    }

    return product;
  }

  async update(id: string, updateProductDto: any, user: User) {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException("Product not found");
    }

    if (!this.hasAccess(user, product.owner.toString())) {
      throw new ForbiddenException("Access denied");
    }

    Object.assign(product, updateProductDto);
    return await product.save();
  }

  async remove(id: string, user: User) {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException("Product not found");
    }

    if (!this.hasAccess(user, product.owner.toString())) {
      throw new ForbiddenException("Access denied");
    }

    await this.productModel.findByIdAndDelete(id);
    return { message: "Product deleted successfully" };
  }

  async findByRestaurant(restaurantId: string) {
    const products = await this.productModel
      .find({ restaurants: restaurantId })
      .populate("categories", "translations")
      .populate("image")
      .populate("video")
      .sort({ createdAt: -1 });

    return products;
  }

  async updateStopList(id: string, isStopList: boolean, user: User) {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException("Product not found");
    }

    if (!this.hasAccess(user, product.owner.toString())) {
      throw new ForbiddenException("Access denied");
    }

    product.isStopList = isStopList;
    return await product.save();
  }

  private hasAccess(user: User, ownerId: string): boolean {
    return (
      user.role === UserRoleEnum.SuperAdmin || user._id.toString() === ownerId
    );
  }
}
