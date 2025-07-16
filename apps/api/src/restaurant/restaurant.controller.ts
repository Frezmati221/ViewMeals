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
import { RestaurantService } from "@viewmeals-server/common";
import { CreateRestaurantDto, UpdateRestaurantDto } from "./dto/restaurant.dto";
import { AuthGuard } from "@nestjs/passport";

@ApiTags("Restaurants")
@Controller({
  path: "res",
  version: "1",
})
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post()
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Create restaurant",
    description: "Create a new restaurant. Requires authentication.",
  })
  @ApiResponse({
    status: 201,
    description: "Restaurant created successfully",
    schema: {
      example: {
        _id: "64f7a1b2c3d4e5f6a7b8c9d0",
        name: "My Restaurant",
        restaurantName: "My Amazing Restaurant",
        restaurantUrlPath: "my-restaurant",
        langs: ["en", "es"],
        slides: [],
        socialLinks: [],
        isActive: true,
        createdAt: "2023-09-06T10:30:00.000Z",
        updatedAt: "2023-09-06T10:30:00.000Z",
      },
    },
  })
  @ApiBadRequestResponse({ description: "Invalid input data" })
  @ApiUnauthorizedResponse({ description: "Authentication required" })
  async create(
    @Body(ValidationPipe) createRestaurantDto: CreateRestaurantDto,
    @Request() req
  ) {
    return this.restaurantService.create(createRestaurantDto, req.user);
  }

  @Get()
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Get all restaurants",
    description:
      "Retrieve all restaurants with optional filtering. Requires authentication.",
  })
  @ApiQuery({
    name: "page",
    required: false,
    description: "Page number for pagination",
    example: 1,
  })
  @ApiQuery({
    name: "limit",
    required: false,
    description: "Number of items per page",
    example: 10,
  })
  @ApiQuery({
    name: "search",
    required: false,
    description: "Search term for filtering restaurants",
    example: "pizza",
  })
  @ApiResponse({
    status: 200,
    description: "Restaurants retrieved successfully",
    schema: {
      example: {
        restaurants: [
          {
            _id: "64f7a1b2c3d4e5f6a7b8c9d0",
            name: "My Restaurant",
            restaurantName: "My Amazing Restaurant",
            restaurantUrlPath: "my-restaurant",
            isActive: true,
          },
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          pages: 1,
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: "Authentication required" })
  async findAll(@Query() query: any, @Request() req) {
    return this.restaurantService.findAll(query, req.user);
  }

  @Get("by-url/:urlPath")
  @ApiOperation({
    summary: "Get restaurant by URL path",
    description:
      "Retrieve a restaurant by its unique URL path. Public endpoint.",
  })
  @ApiParam({
    name: "urlPath",
    description: "Unique URL path of the restaurant",
    example: "my-restaurant",
  })
  @ApiResponse({
    status: 200,
    description: "Restaurant retrieved successfully",
    schema: {
      example: {
        _id: "64f7a1b2c3d4e5f6a7b8c9d0",
        name: "My Restaurant",
        restaurantName: "My Amazing Restaurant",
        restaurantUrlPath: "my-restaurant",
        langs: ["en", "es"],
        slides: [],
        socialLinks: [],
        isActive: true,
      },
    },
  })
  @ApiNotFoundResponse({ description: "Restaurant not found" })
  async findByUrlPath(@Param("urlPath") urlPath: string) {
    return this.restaurantService.findByUrlPath(urlPath);
  }

  @Get(":id")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Get restaurant by ID",
    description:
      "Retrieve a specific restaurant by its MongoDB ObjectId. Requires authentication.",
  })
  @ApiParam({
    name: "id",
    description: "MongoDB ObjectId of the restaurant",
    example: "64f7a1b2c3d4e5f6a7b8c9d0",
  })
  @ApiResponse({
    status: 200,
    description: "Restaurant retrieved successfully",
    schema: {
      example: {
        _id: "64f7a1b2c3d4e5f6a7b8c9d0",
        name: "My Restaurant",
        restaurantName: "My Amazing Restaurant",
        restaurantUrlPath: "my-restaurant",
        langs: ["en", "es"],
        slides: [],
        socialLinks: [],
        isActive: true,
        createdAt: "2023-09-06T10:30:00.000Z",
        updatedAt: "2023-09-06T10:30:00.000Z",
      },
    },
  })
  @ApiUnauthorizedResponse({ description: "Authentication required" })
  @ApiNotFoundResponse({ description: "Restaurant not found" })
  @ApiBadRequestResponse({ description: "Invalid restaurant ID format" })
  async findOne(@Param("id") id: string, @Request() req) {
    return this.restaurantService.findOne(id, req.user);
  }

  @Patch(":id")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Update restaurant",
    description:
      "Update an existing restaurant. Requires authentication and ownership.",
  })
  @ApiParam({
    name: "id",
    description: "MongoDB ObjectId of the restaurant to update",
    example: "64f7a1b2c3d4e5f6a7b8c9d0",
  })
  @ApiResponse({
    status: 200,
    description: "Restaurant updated successfully",
    schema: {
      example: {
        _id: "64f7a1b2c3d4e5f6a7b8c9d0",
        name: "Updated Restaurant Name",
        restaurantName: "My Amazing Updated Restaurant",
        restaurantUrlPath: "my-restaurant",
        langs: ["en", "es", "fr"],
        slides: [],
        socialLinks: [],
        isActive: true,
        updatedAt: "2023-09-06T11:30:00.000Z",
      },
    },
  })
  @ApiUnauthorizedResponse({ description: "Authentication required" })
  @ApiNotFoundResponse({ description: "Restaurant not found" })
  @ApiBadRequestResponse({
    description: "Invalid input data or restaurant ID format",
  })
  async update(
    @Param("id") id: string,
    @Body(ValidationPipe) updateRestaurantDto: UpdateRestaurantDto,
    @Request() req
  ) {
    return this.restaurantService.update(id, updateRestaurantDto, req.user);
  }

  @Delete(":id")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Delete restaurant",
    description: "Delete a restaurant. Requires authentication and ownership.",
  })
  @ApiParam({
    name: "id",
    description: "MongoDB ObjectId of the restaurant to delete",
    example: "64f7a1b2c3d4e5f6a7b8c9d0",
  })
  @ApiResponse({
    status: 200,
    description: "Restaurant deleted successfully",
    schema: {
      example: {
        message: "Restaurant deleted successfully",
        deletedId: "64f7a1b2c3d4e5f6a7b8c9d0",
      },
    },
  })
  @ApiUnauthorizedResponse({ description: "Authentication required" })
  @ApiNotFoundResponse({ description: "Restaurant not found" })
  @ApiBadRequestResponse({ description: "Invalid restaurant ID format" })
  async remove(@Param("id") id: string, @Request() req) {
    return this.restaurantService.remove(id, req.user);
  }
}
