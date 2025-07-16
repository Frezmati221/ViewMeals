import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PlanRepository } from "./plan.repository";
import { PlanService } from "./plan.service";
import { PlanSchema } from "../database";

@Module({
  imports: [MongooseModule.forFeature([{ name: "Plan", schema: PlanSchema }])],
  providers: [PlanRepository, PlanService],
  exports: [PlanService, PlanRepository],
})
export class PlanLibModule {}
