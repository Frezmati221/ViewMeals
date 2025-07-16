import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import {
  RegisterDto,
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from "./dto/auth.dto";
import { Roles, UserRoleEnum, RolesGuard } from "@viewmeals-server/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";

@ApiTags("Authentication")
@Controller({
  path: "auth",
  version: "1",
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register-restaurant-admin")
  @Roles(UserRoleEnum.SuperAdmin)
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "Register restaurant admin" })
  @ApiResponse({ status: 201, description: "User registered successfully" })
  async registerRestaurantAdmin(
    @Body(ValidationPipe) registerDto: RegisterDto
  ) {
    return this.authService.registerRestaurantAdmin(
      registerDto.name,
      registerDto.email,
      registerDto.password,
      registerDto.stripe
    );
  }

  @Post("login")
  @ApiOperation({ summary: "Login user" })
  @ApiResponse({ status: 200, description: "User logged in successfully" })
  async login(@Body(ValidationPipe) loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Post("forgot-password")
  @ApiOperation({ summary: "Request password reset" })
  @ApiResponse({ status: 200, description: "Password reset email sent" })
  async forgotPassword(
    @Body(ValidationPipe) forgotPasswordDto: ForgotPasswordDto
  ) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Post("reset-password")
  @ApiOperation({ summary: "Reset password" })
  @ApiResponse({ status: 200, description: "Password reset successfully" })
  async resetPassword(
    @Body(ValidationPipe) resetPasswordDto: ResetPasswordDto
  ) {
    return this.authService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.newPassword
    );
  }
}
