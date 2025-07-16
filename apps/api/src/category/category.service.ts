import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Category, User, UserRoleEnum } from "@viewmeals-server/common";
import { CreateCategoryDto, UpdateCategoryDto } from "./dto/category.dto";

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel("Category") private categoryModel: Model<Category>
  ) {}

  async create(createCategoryDto: CreateCategoryDto, user: User) {
    const category = new this.categoryModel({
      ...createCategoryDto,
      owner: user._id,
    });

    return await category.save();
  }

  async findAll(query: any, user?: User) {
    const { page = 1, limit = 10, search, restaurant } = query;
    const skip = (page - 1) * limit;

    const filter: any = {};

    // If user is provided and not super admin, only show own categories
    if (user && user.role !== UserRoleEnum.SuperAdmin) {
      filter.owner = user._id;
    }

    // Filter by restaurant if provided
    if (restaurant) {
      filter.restaurants = restaurant;
    }

    // Search in translations
    if (search) {
      filter["translations.name"] = { $regex: search, $options: "i" };
    }

    const categories = await this.categoryModel
      .find(filter)
      .populate("owner", "name email")
      .populate("icon")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await this.categoryModel.countDocuments(filter);

    return {
      categories,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, user?: User) {
    const category = await this.categoryModel
      .findById(id)
      .populate("owner", "name email")
      .populate("icon");

    if (!category) {
      throw new NotFoundException("Category not found");
    }

    // Check access rights if user is provided
    if (user && !this.hasAccess(user, category.owner.toString())) {
      throw new ForbiddenException("Access denied");
    }

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto, user: User) {
    const category = await this.categoryModel.findById(id);

    if (!category) {
      throw new NotFoundException("Category not found");
    }

    // Check access rights
    if (!this.hasAccess(user, category.owner.toString())) {
      throw new ForbiddenException("Access denied");
    }

    Object.assign(category, updateCategoryDto);
    return await category.save();
  }

  async remove(id: string, user: User) {
    const category = await this.categoryModel.findById(id);

    if (!category) {
      throw new NotFoundException("Category not found");
    }

    // Check access rights
    if (!this.hasAccess(user, category.owner.toString())) {
      throw new ForbiddenException("Access denied");
    }

    await this.categoryModel.findByIdAndDelete(id);
    return { message: "Category deleted successfully" };
  }

  async findByRestaurant(restaurantId: string) {
    const categories = await this.categoryModel
      .find({ restaurants: restaurantId })
      .populate("icon")
      .sort({ createdAt: -1 });

    return categories;
  }

  private hasAccess(user: User, ownerId: string): boolean {
    return (
      user.role === UserRoleEnum.SuperAdmin || user._id.toString() === ownerId
    );
  }
}
