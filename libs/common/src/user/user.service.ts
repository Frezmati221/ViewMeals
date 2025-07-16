import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { User } from "../database/user/schemas/user.schema";

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getUserByToken(userId: string): Promise<User> {
    const user = await this.userRepository.findById(
      userId,
      "-password -stripe"
    );
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  async getUserById(userId: string): Promise<User> {
    const user = await this.userRepository.findById(
      userId,
      "-password -stripe"
    );
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  async deleteUser(userId: string): Promise<{ message: string }> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    await this.userRepository.delete(userId);
    return { message: "User deleted successfully" };
  }

  async getUserList(query: any): Promise<{
    users: User[];
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
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await this.userRepository.findMany(filter, {
      select: "-password -stripe",
      skip,
      limit,
      sort: { createdAt: -1 },
    });

    const total = await this.userRepository.countDocuments(filter);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }
}
