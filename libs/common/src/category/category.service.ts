import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { CategoryRepository } from "./category.repository";
import { Category, User, UserRoleEnum } from "../database";

@Injectable()
export class CategoryService {
  constructor(private categoryRepository: CategoryRepository) {}

  async create(createCategoryDto: any, user: User): Promise<Category> {
    const categoryData = {
      ...createCategoryDto,
      owner: user._id,
    };
    return await this.categoryRepository.create(categoryData);
  }

  async findAll(
    query: any,
    user?: User
  ): Promise<{
    categories: Category[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
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

    const categories = await this.categoryRepository.findMany(filter, {
      skip,
      limit,
      sort: { createdAt: -1 },
      populate: true,
    });

    const total = await this.categoryRepository.countDocuments(filter);

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

  async findOne(id: string, user?: User): Promise<Category> {
    const category = await this.categoryRepository.findByIdWithPopulate(id);

    if (!category) {
      throw new NotFoundException("Category not found");
    }

    // Check access rights if user is provided
    if (user && !this.hasAccess(user, category.owner.toString())) {
      throw new ForbiddenException("Access denied");
    }

    return category;
  }

  async update(
    id: string,
    updateCategoryDto: any,
    user: User
  ): Promise<Category> {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new NotFoundException("Category not found");
    }

    // Check access rights
    if (!this.hasAccess(user, category.owner.toString())) {
      throw new ForbiddenException("Access denied");
    }

    const updatedCategory = await this.categoryRepository.update(
      id,
      updateCategoryDto
    );
    return updatedCategory!;
  }

  async remove(id: string, user: User): Promise<{ message: string }> {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new NotFoundException("Category not found");
    }

    // Check access rights
    if (!this.hasAccess(user, category.owner.toString())) {
      throw new ForbiddenException("Access denied");
    }

    await this.categoryRepository.delete(id);
    return { message: "Category deleted successfully" };
  }

  async findByRestaurant(restaurantId: string): Promise<Category[]> {
    return await this.categoryRepository.findByRestaurant(restaurantId);
  }

  private hasAccess(user: User, ownerId: string): boolean {
    return (
      user.role === UserRoleEnum.SuperAdmin || user._id.toString() === ownerId
    );
  }
}
