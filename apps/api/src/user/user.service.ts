import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "@viewmeals-server/common";

@Injectable()
export class UserService {
  constructor(@InjectModel("User") private userModel: Model<User>) {}

  async getUserByToken(userId: string) {
    const user = await this.userModel
      .findById(userId)
      .select("-password -stripe");
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  async getUserById(userId: string) {
    const user = await this.userModel
      .findById(userId)
      .select("-password -stripe");
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  async deleteUser(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    await this.userModel.findByIdAndDelete(userId);
    return { message: "User deleted successfully" };
  }

  async getUserList(query: any) {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await this.userModel
      .find(filter)
      .select("-password -stripe")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await this.userModel.countDocuments(filter);

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
