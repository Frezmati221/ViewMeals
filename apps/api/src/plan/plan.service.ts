import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Plan } from "@viewmeals-server/common";
import { Model } from "mongoose";

@Injectable()
export class PlanService {
  constructor(@InjectModel("Plan") private planModel: Model<Plan>) {}

  async create(createPlanDto: any) {
    const plan = new this.planModel(createPlanDto);
    return await plan.save();
  }

  async findAll(query: any) {
    const { page = 1, limit = 10, isActive } = query;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (isActive !== undefined) filter.isActive = isActive === "true";

    const plans = await this.planModel
      .find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ sortOrder: 1, createdAt: -1 });

    const total = await this.planModel.countDocuments(filter);

    return {
      plans,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const plan = await this.planModel.findById(id);
    if (!plan) {
      throw new NotFoundException("Plan not found");
    }
    return plan;
  }

  async update(id: string, updatePlanDto: any) {
    const plan = await this.planModel.findById(id);
    if (!plan) {
      throw new NotFoundException("Plan not found");
    }

    Object.assign(plan, updatePlanDto);
    return await plan.save();
  }

  async remove(id: string) {
    const plan = await this.planModel.findById(id);
    if (!plan) {
      throw new NotFoundException("Plan not found");
    }

    await this.planModel.findByIdAndDelete(id);
    return { message: "Plan deleted successfully" };
  }
}
