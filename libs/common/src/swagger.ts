import { INestApplication } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { ViewmealsConfigService } from "./config";

export function setupSwagger(app: INestApplication): void {
  const swaggerConfig = app.get(ViewmealsConfigService).swaggerConfig;
  const title = swaggerConfig.title;
  const description = swaggerConfig.description;
  const path = swaggerConfig.path;
  const version = swaggerConfig.version;

  const config = new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .setVersion(version)
    .addTag("Endpoints")
    .addBearerAuth({
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
      name: "JWT",
      description: "Enter JWT token",
      in: "header",
    })
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    ignoreGlobalPrefix: false,
  });

  SwaggerModule.setup(path, app, document);
}
