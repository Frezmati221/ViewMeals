import { Environment } from "../env.enum";

export interface AppConfig {
  apiVersion: string;
  environment: Environment;
  name: string;
  port: number;
  jwtPrivateKeyFile: string;
  jwtPublicKeyFile: string;
}
