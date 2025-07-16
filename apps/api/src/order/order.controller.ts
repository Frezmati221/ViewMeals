import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
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
import { OrderService } from "@viewmeals-server/common";
import { AuthGuard } from "@nestjs/passport";

@ApiTags("Orders")
@Controller({
  path: "order",
  version: "1",
})
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: "Create order" })
  @ApiResponse({ status: 201, description: "Order created successfully" })
  async create(@Body(ValidationPipe) createOrderDto: any) {
    return this.orderService.create(createOrderDto);
  }

  @Get()
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all orders" })
  @ApiResponse({ status: 200, description: "Orders retrieved successfully" })
  async findAll(@Query() query: any) {
    return this.orderService.findAll(query);
  }

  @Get(":id")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get order by ID" })
  @ApiResponse({ status: 200, description: "Order retrieved successfully" })
  async findOne(@Param("id") id: string) {
    return this.orderService.findOne(id);
  }

  @Patch(":id/status")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update order status" })
  @ApiResponse({
    status: 200,
    description: "Order status updated successfully",
  })
  async updateStatus(@Param("id") id: string, @Body("status") status: string) {
    return this.orderService.updateStatus(id, status);
  }
}
