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
} from "@nestjs/swagger";
import { CategoryService } from "@viewmeals-server/common";
import { CreateCategoryDto, UpdateCategoryDto } from "./dto/category.dto";
import { AuthGuard } from "@nestjs/passport";

@ApiTags("Categories")
@Controller({
  path: "category",
  version: "1",
})
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create category" })
  @ApiResponse({ status: 201, description: "Category created successfully" })
  async create(
    @Body(ValidationPipe) createCategoryDto: CreateCategoryDto,
    @Request() req
  ) {
    return this.categoryService.create(createCategoryDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: "Get all categories" })
  @ApiResponse({
    status: 200,
    description: "Categories retrieved successfully",
  })
  async findAll(@Query() query: any, @Request() req) {
    return this.categoryService.findAll(query, req.user);
  }

  @Get("restaurant/:restaurantId")
  @ApiOperation({ summary: "Get categories by restaurant" })
  @ApiResponse({
    status: 200,
    description: "Categories retrieved successfully",
  })
  async findByRestaurant(@Param("restaurantId") restaurantId: string) {
    return this.categoryService.findByRestaurant(restaurantId);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get category by ID" })
  @ApiResponse({ status: 200, description: "Category retrieved successfully" })
  async findOne(@Param("id") id: string, @Request() req) {
    return this.categoryService.findOne(id, req.user);
  }

  @Patch(":id")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update category" })
  @ApiResponse({ status: 200, description: "Category updated successfully" })
  async update(
    @Param("id") id: string,
    @Body(ValidationPipe) updateCategoryDto: UpdateCategoryDto,
    @Request() req
  ) {
    return this.categoryService.update(id, updateCategoryDto, req.user);
  }

  @Delete(":id")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete category" })
  @ApiResponse({ status: 200, description: "Category deleted successfully" })
  async remove(@Param("id") id: string, @Request() req) {
    return this.categoryService.remove(id, req.user);
  }
}
