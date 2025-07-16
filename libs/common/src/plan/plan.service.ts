import { Injectable, NotFoundException } from "@nestjs/common";
import { PlanRepository } from "./plan.repository";
import { Plan } from "../database/plan/schemas/plan.schema";

@Injectable()
export class PlanService {
  constructor(private planRepository: PlanRepository) {}

  async create(createPlanDto: any): Promise<Plan> {
    return await this.planRepository.create(createPlanDto);
  }

  async findAll(query: any): Promise<{
    plans: Plan[];
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
      filter.name = { $regex: search, $options: "i" };
    }

    const plans = await this.planRepository.findMany(filter, {
      skip,
      limit,
      sort: { createdAt: -1 },
    });

    const total = await this.planRepository.countDocuments(filter);

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

  async findOne(id: string): Promise<Plan> {
    const plan = await this.planRepository.findById(id);
    if (!plan) {
      throw new NotFoundException("Plan not found");
    }
    return plan;
  }

  async update(id: string, updatePlanDto: any): Promise<Plan> {
    const plan = await this.planRepository.findById(id);
    if (!plan) {
      throw new NotFoundException("Plan not found");
    }

    const updatedPlan = await this.planRepository.update(id, updatePlanDto);
    return updatedPlan!;
  }

  async remove(id: string): Promise<{ message: string }> {
    const plan = await this.planRepository.findById(id);
    if (!plan) {
      throw new NotFoundException("Plan not found");
    }

    await this.planRepository.delete(id);
    return { message: "Plan deleted successfully" };
  }
}
