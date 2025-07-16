import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller";
import { UserSchema, ViewmealsConfigService } from "@viewmeals-server/common";
import * as fs from "fs";
import { JwtStrategy } from "@viewmeals-server/common/auth/jwt.strategy";
import { Algorithm } from "jsonwebtoken";
import { UserModule } from "../user/user.module";
import { AuthService } from "./auth.service";

const passportModule = PassportModule.register({ defaultStrategy: "jwt" });

const jwtFactory = {
  useFactory: async (configService: ViewmealsConfigService) => ({
    privateKey: fs.readFileSync(configService.appConfig.jwtPrivateKeyFile),
    signOptions: { expiresIn: "30 days", algorithm: "RS256" as Algorithm },
  }),
  inject: [ViewmealsConfigService],
};

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "User", schema: UserSchema }]),
    JwtModule.registerAsync(jwtFactory),
    passportModule,
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, passportModule],
})
export class AuthModule {}
