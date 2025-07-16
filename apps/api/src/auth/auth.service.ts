import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from "bcrypt";
import * as nodemailer from "nodemailer";
import { ConfigService } from "@nestjs/config";
import { User, UserRoleEnum } from "@viewmeals-server/common";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel("User") private userModel: Model<User>,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async registerRestaurantAdmin(
    name: string,
    email: string,
    password: string,
    stripe?: any
  ) {
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new this.userModel({
      name,
      email,
      password: hashedPassword,
      role: UserRoleEnum.RestaurantAdmin,
      stripe: stripe ?? {},
    });

    await user.save();

    const accessToken = this.jwtService.sign({
      sub: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    return { accessToken };
  }

  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new BadRequestException("User not found");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new BadRequestException("Invalid password");
    }

    const token = this.jwtService.sign({
      sub: user._id,
    });

    return { token, user };
  }

  async forgotPassword(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new BadRequestException("User not found");
    }

    const passwordToken = this.jwtService.sign(
      { userId: user._id },
      {
        expiresIn:
          this.configService.get<string>("RESET_PASSWORD_EXPIRATION") ||
          "3600s",
      }
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: this.configService.get<string>("EMAIL_USER"),
        pass: this.configService.get<string>("EMAIL_APP_PASSWORD"),
      },
    });

    const resetLink = `${this.configService.get<string>("FRONTEND_URL")}/auth/reset-password?token=${passwordToken}`;

    await transporter.sendMail({
      from: this.configService.get<string>("EMAIL_USER"),
      to: email,
      subject: "Reset Password",
      text: `Follow the link to reset your password: ${resetLink}`,
      html: `<p>Follow the <a href="${resetLink}">link</a> to reset your password.</p>`,
    });

    return { message: "Password reset email sent" };
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.userModel.findById(decoded.userId);

      if (!user) {
        throw new BadRequestException("Invalid token");
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();

      return { message: "Password reset successful" };
    } catch (error) {
      throw new BadRequestException("Invalid or expired token");
    }
  }

  // private generateTokenResponse(user: User) {
  //   const payload = { userId: user._id };
  //   const token = this.jwtService.sign(payload);

  //   return {
  //     token,
  //     user: {
  //       id: user._id,
  //       name: user.name,
  //       email: user.email,
  //       role: user.role,
  //     },
  //   };
  // }
}
