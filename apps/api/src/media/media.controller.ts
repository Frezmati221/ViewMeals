import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
} from "@nestjs/swagger";
import { MediaService } from "@viewmeals-server/common";
import { AuthGuard } from "@nestjs/passport";

@ApiTags("Media")
@Controller({
  path: "media",
  version: "1",
})
@UseGuards(AuthGuard("jwt"))
@ApiBearerAuth()
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  @ApiOperation({ summary: "Upload media file" })
  @ApiConsumes("multipart/form-data")
  @ApiResponse({ status: 201, description: "Media uploaded successfully" })
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Request() req) {
    return this.mediaService.create(file, req.user);
  }

  @Get()
  @ApiOperation({ summary: "Get all media files" })
  @ApiResponse({
    status: 200,
    description: "Media files retrieved successfully",
  })
  async findAll(@Query() query: any, @Request() req) {
    return this.mediaService.findAll(query, req.user);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get media file by ID" })
  @ApiResponse({
    status: 200,
    description: "Media file retrieved successfully",
  })
  async findOne(@Param("id") id: string, @Request() req) {
    return this.mediaService.findOne(id, req.user);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete media file" })
  @ApiResponse({ status: 200, description: "Media file deleted successfully" })
  async remove(@Param("id") id: string, @Request() req) {
    return this.mediaService.remove(id, req.user);
  }
}
