import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { PlanService } from "@viewmeals-server/common";
import { AuthGuard } from "@nestjs/passport";

@ApiTags("Plans")
@Controller({
  path: "plan",
  version: "1",
})
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Post()
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create plan" })
  @ApiResponse({ status: 201, description: "Plan created successfully" })
  async create(@Body(ValidationPipe) createPlanDto: any) {
    return this.planService.create(createPlanDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all plans" })
  @ApiResponse({ status: 200, description: "Plans retrieved successfully" })
  async findAll(@Query() query: any) {
    return this.planService.findAll(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get plan by ID" })
  @ApiResponse({ status: 200, description: "Plan retrieved successfully" })
  async findOne(@Param("id") id: string) {
    return this.planService.findOne(id);
  }

  @Patch(":id")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update plan" })
  @ApiResponse({ status: 200, description: "Plan updated successfully" })
  async update(
    @Param("id") id: string,
    @Body(ValidationPipe) updatePlanDto: any
  ) {
    return this.planService.update(id, updatePlanDto);
  }

  @Delete(":id")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete plan" })
  @ApiResponse({ status: 200, description: "Plan deleted successfully" })
  async remove(@Param("id") id: string) {
    return this.planService.remove(id);
  }
}
