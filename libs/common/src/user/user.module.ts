import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserRepository } from "./user.repository";
import { UserService } from "./user.service";
import { UserSchema } from "../database";

@Module({
  imports: [MongooseModule.forFeature([{ name: "User", schema: UserSchema }])],
  providers: [UserRepository, UserService],
  exports: [UserService, UserRepository],
})
export class UserLibModule {}
