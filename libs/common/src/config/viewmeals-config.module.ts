import { Global, Module } from "@nestjs/common";
import { ViewmealsConfigService } from "./viewmeals-config.service";

@Global()
@Module({
  imports: [],
  providers: [ViewmealsConfigService],
  exports: [ViewmealsConfigService],
})
export class ViewmealsConfigModule {}
