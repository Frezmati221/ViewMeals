import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserLibModule } from "@viewmeals-server/common";

@Module({
  imports: [UserLibModule],
  controllers: [UserController],
})
export class UserModule {}
