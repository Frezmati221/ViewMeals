export function getEnvironment(env: string): Environment | undefined {
  return env as Environment;
}

export enum Environment {
  Production = 'production',
  Stage = 'stage',
  Development = 'development',
  Local = 'local',
}
