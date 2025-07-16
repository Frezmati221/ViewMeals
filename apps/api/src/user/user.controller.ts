import {
  Controller,
  Get,
  Delete,
  Param,
  Query,
  UseGuards,
  Req,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { UserService } from "@viewmeals-server/common";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
import { Roles } from "@viewmeals-server/common/decorators";
import { UserRoleEnum } from "@viewmeals-server/common";

@ApiTags("Users")
@Controller({
  path: "user",
  version: "1",
})
@UseGuards(AuthGuard("jwt"))
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("profile")
  @ApiOperation({ summary: "Get current user profile" })
  @ApiResponse({
    status: 200,
    description: "User profile retrieved successfully",
  })
  async getUserByToken(@Req() req: Request) {
    return this.userService.getUserByToken(req.user._id);
  }

  @Get("list")
  @Roles(UserRoleEnum.SuperAdmin)
  @ApiOperation({ summary: "Get user list (Super Admin only)" })
  @ApiResponse({ status: 200, description: "User list retrieved successfully" })
  async getUserList(@Query() query: any) {
    return this.userService.getUserList(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get user by ID" })
  @ApiResponse({ status: 200, description: "User retrieved successfully" })
  async getUserById(@Param("id") id: string) {
    return this.userService.getUserById(id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete user" })
  @ApiResponse({ status: 200, description: "User deleted successfully" })
  async deleteUser(@Param("id") id: string) {
    return this.userService.deleteUser(id);
  }
}
