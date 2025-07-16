import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Plan } from "../database";

@Injectable()
export class PlanRepository {
  constructor(@InjectModel("Plan") private planModel: Model<Plan>) {}

  async create(planData: Partial<Plan>): Promise<Plan> {
    const plan = new this.planModel(planData);
    return plan.save();
  }

  async findById(id: string): Promise<Plan | null> {
    return this.planModel.findById(id).exec();
  }

  async findMany(
    filter: any,
    options: {
      skip?: number;
      limit?: number;
      sort?: any;
    } = {}
  ): Promise<Plan[]> {
    let query = this.planModel.find(filter);

    if (options.skip) {
      query = query.skip(options.skip);
    }
    if (options.limit) {
      query = query.limit(options.limit);
    }
    if (options.sort) {
      query = query.sort(options.sort);
    }

    return query.exec();
  }

  async countDocuments(filter: any): Promise<number> {
    return this.planModel.countDocuments(filter).exec();
  }

  async update(id: string, updateData: Partial<Plan>): Promise<Plan | null> {
    return this.planModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Plan | null> {
    return this.planModel.findByIdAndDelete(id).exec();
  }
}
