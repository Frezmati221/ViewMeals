import { SwaggerConfig } from "@viewmeals-server/common";

export default (): { [key: string]: SwaggerConfig } => ({
  swagger: {
    title: "ViewMeals",
    description: "ViewMeals Server API",
    path: "v1/api-docs",
    version: "1.0",
  },
});
