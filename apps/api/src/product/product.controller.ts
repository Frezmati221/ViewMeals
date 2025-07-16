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
  Request,
  ValidationPipe,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
} from "@nestjs/swagger";
import { ProductService } from "@viewmeals-server/common";
import { CreateProductDto, UpdateProductDto } from "./dto/product.dto";
import { AuthGuard } from "@nestjs/passport";

@ApiTags("Products")
@Controller({
  path: "product",
  version: "1",
})
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Create product",
    description:
      "Create a new product. Requires authentication and proper data validation.",
  })
  @ApiResponse({
    status: 201,
    description: "Product created successfully",
    schema: {
      example: {
        _id: "64f7a1b2c3d4e5f6a7b8c9d0",
        translations: {
          en: {
            name: "Margherita Pizza",
            description:
              "Classic pizza with tomato sauce, mozzarella and basil",
          },
        },
        price: 12.99,
        grams: 350,
        categories: ["64f7a1b2c3d4e5f6a7b8c9d1"],
        restaurants: ["64f7a1b2c3d4e5f6a7b8c9d2"],
        likes: 0,
        isStopList: false,
        createdAt: "2023-09-06T10:30:00.000Z",
        updatedAt: "2023-09-06T10:30:00.000Z",
      },
    },
  })
  @ApiBadRequestResponse({
    description:
      "Invalid input data - missing required fields (translations, price, grams, categories, restaurants)",
  })
  @ApiUnauthorizedResponse({ description: "Authentication required" })
  async create(
    @Body(ValidationPipe) createProductDto: CreateProductDto,
    @Request() req
  ) {
    return this.productService.create(createProductDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: "Get all products" })
  @ApiResponse({ status: 200, description: "Products retrieved successfully" })
  async findAll(@Query() query: any, @Request() req) {
    return this.productService.findAll(query, req.user);
  }

  @Get("restaurant/:restaurantId")
  @ApiOperation({ summary: "Get products by restaurant" })
  @ApiResponse({ status: 200, description: "Products retrieved successfully" })
  async findByRestaurant(@Param("restaurantId") restaurantId: string) {
    return this.productService.findByRestaurant(restaurantId);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get product by ID" })
  @ApiResponse({ status: 200, description: "Product retrieved successfully" })
  async findOne(@Param("id") id: string, @Request() req) {
    return this.productService.findOne(id, req.user);
  }

  @Patch(":id")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Update product",
    description:
      "Update an existing product. Requires authentication and ownership.",
  })
  @ApiParam({
    name: "id",
    description: "MongoDB ObjectId of the product to update",
    example: "64f7a1b2c3d4e5f6a7b8c9d0",
  })
  @ApiResponse({
    status: 200,
    description: "Product updated successfully",
    schema: {
      example: {
        _id: "64f7a1b2c3d4e5f6a7b8c9d0",
        translations: {
          en: {
            name: "Updated Margherita Pizza",
            description:
              "Updated classic pizza with tomato sauce, mozzarella and basil",
          },
        },
        price: 13.99,
        grams: 400,
        categories: ["64f7a1b2c3d4e5f6a7b8c9d1"],
        restaurants: ["64f7a1b2c3d4e5f6a7b8c9d2"],
        likes: 5,
        isStopList: false,
        updatedAt: "2023-09-06T11:30:00.000Z",
      },
    },
  })
  @ApiBadRequestResponse({
    description: "Invalid input data or product ID format",
  })
  @ApiUnauthorizedResponse({ description: "Authentication required" })
  @ApiNotFoundResponse({ description: "Product not found" })
  async update(
    @Param("id") id: string,
    @Body(ValidationPipe) updateProductDto: UpdateProductDto,
    @Request() req
  ) {
    return this.productService.update(id, updateProductDto, req.user);
  }

  @Patch(":id/stop-list")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update product stop list status" })
  @ApiResponse({
    status: 200,
    description: "Product stop list status updated successfully",
  })
  async updateStopList(
    @Param("id") id: string,
    @Body("isStopList") isStopList: boolean,
    @Request() req
  ) {
    return this.productService.updateStopList(id, isStopList, req.user);
  }

  @Delete(":id")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete product" })
  @ApiResponse({ status: 200, description: "Product deleted successfully" })
  async remove(@Param("id") id: string, @Request() req) {
    return this.productService.remove(id, req.user);
  }
}
