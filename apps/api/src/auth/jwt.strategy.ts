// import { Injectable } from "@nestjs/common";
// import { PassportStrategy } from "@nestjs/passport";
// import { Strategy, ExtractJwt } from "passport-jwt";
// import { ConfigService } from "@nestjs/config";
// import { InjectModel } from "@nestjs/mongoose";
// import { Model } from "mongoose";
// import { User } from "@viewmeals-server/common";

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor(
//     @InjectModel("User") private userModel: Model<User>,
//     private configService: ConfigService
//   ) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       secretOrKey: configService.get<string>("JWT_SECRET_KEY"),
//     });
//   }

//   async validate(payload: any) {
//     const user = await this.userModel
//       .findById(payload.userId)
//       .select("-password -stripe");

//     if (!user) {
//       return null;
//     }

//     return user;
//   }
// }
