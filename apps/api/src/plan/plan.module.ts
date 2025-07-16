import { Module } from "@nestjs/common";
import { PlanController } from "./plan.controller";
import { PlanLibModule } from "@viewmeals-server/common";

@Module({
  imports: [PlanLibModule],
  controllers: [PlanController],
})
export class PlanModule {}
