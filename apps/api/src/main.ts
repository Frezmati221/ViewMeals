import { ValidationPipe, VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import {
  AllExceptionsFilter,
  Environment,
  setupSwagger,
} from "@viewmeals-server/common";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";

import { ViewmealsConfigService } from "@viewmeals-server/common";

async function bootstrap() {
  (BigInt.prototype as any).toJSON = function () {
    return this.toString();
  };

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // app.useStaticAssets(join(__dirname, '..', '..', '..', 'uploads'), {
  //   prefix: '/uploads/',
  // });

  const configService = app.get(ViewmealsConfigService);

  // Global exception filter for better error handling
  app.useGlobalFilters(new AllExceptionsFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.enableCors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "ngrok-skip-browser-warning",
      "Access-Control-Allow-Origin",
      "X-Requested-With",
      "User-Agent",
    ],
    credentials: true,
  });

  setupSwagger(app);

  app.enableShutdownHooks();

  const appConfig = configService.appConfig;
  switch (appConfig.environment) {
    case Environment.Development:
    case Environment.Local:
      app.useLogger(["error", "warn", "debug", "verbose"]);
      break;
    case Environment.Stage:
      app.useLogger(["error", "warn", "debug"]);
      break;
    case Environment.Production:
      app.useLogger(["error", "warn"]);
      break;
    default:
      app.useLogger(["error", "warn"]);
      break;
  }

  await app.listen(appConfig.port);
}
bootstrap();
