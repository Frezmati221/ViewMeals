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
import { AuthGuard } from "@nestjs/passport";
import { IconService } from "@viewmeals-server/common";
import { CreateIconDto, UpdateIconDto } from "./dto";

@ApiTags("Icons")
@Controller({
  path: "icon",
  version: "1",
})
@UseGuards(AuthGuard("jwt"))
@ApiBearerAuth()
export class IconController {
  constructor(private readonly iconService: IconService) {}

  @Post()
  @ApiOperation({ summary: "Create icon" })
  @ApiResponse({ status: 201, description: "Icon created successfully" })
  async create(
    @Body(ValidationPipe) createIconDto: CreateIconDto,
    @Request() req
  ) {
    return this.iconService.create(createIconDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all icons" })
  @ApiResponse({ status: 200, description: "Icons retrieved successfully" })
  async findAll(@Query() query: any, @Request() req) {
    return this.iconService.findAll(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get icon by ID" })
  @ApiResponse({ status: 200, description: "Icon retrieved successfully" })
  async findOne(@Param("id") id: string, @Request() req) {
    return this.iconService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update icon" })
  @ApiResponse({ status: 200, description: "Icon updated successfully" })
  async update(
    @Param("id") id: string,
    @Body(ValidationPipe) updateIconDto: UpdateIconDto,
    @Request() req
  ) {
    return this.iconService.update(id, updateIconDto, req.user);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete icon" })
  @ApiResponse({ status: 200, description: "Icon deleted successfully" })
  async remove(@Param("id") id: string, @Request() req) {
    return this.iconService.remove(id);
  }
}
