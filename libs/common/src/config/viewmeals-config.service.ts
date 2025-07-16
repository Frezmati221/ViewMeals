import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";
import { AppConfig } from "./interfaces/app-config.interface";
import { SwaggerConfig } from "./interfaces";

@Injectable()
export class ViewmealsConfigService {
  constructor(private readonly configService: ConfigService) {}

  get swaggerConfig(): SwaggerConfig {
    return this.configService.get<SwaggerConfig>("swagger");
  }

  get appConfig(): AppConfig {
    return this.configService.get<AppConfig>("app");
  }
}
