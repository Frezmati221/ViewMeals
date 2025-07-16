import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as fs from "fs";

import { Payload } from "./jwt.payload";
import { ViewmealsConfigService } from "../config";
import { User } from "../database";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(
    @InjectModel("User") private userModel: Model<User>,
    configService: ViewmealsConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: fs.readFileSync(configService.appConfig.jwtPublicKeyFile),
      ignoreExpiration: false,
    });
  }

  async validate(payload: Payload) {
    const user = await this.userModel
      .findById(payload.sub)
      .select("-password -stripe");

    if (!user) {
      throw new UnauthorizedException("Invalid token");
    }

    return user;
  }
}
