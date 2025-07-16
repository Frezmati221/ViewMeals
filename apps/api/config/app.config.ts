import { getEnvironment, AppConfig } from "@viewmeals-server/common";

export default (): { [key: string]: AppConfig } => ({
  app: {
    apiVersion: process.env.API_VERSION,
    environment: getEnvironment(process.env.NODE_ENV),
    name: process.env.APP_NAME,
    port: process.env.APP_PORT
      ? parseInt(process.env.APP_PORT, 10)
      : process.env.PORT
        ? parseInt(process.env.PORT, 10)
        : 3000,

    jwtPublicKeyFile: process.env.JWT_PUBLIC_KEY_FILE,
    jwtPrivateKeyFile: process.env.JWT_PRIVATE_KEY_FILE,
  },
});
