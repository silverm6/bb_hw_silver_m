export interface Config {
  apiURL: string;
}

export function loadConfig(env: Record<string, string | undefined>): Config {
  return {
    apiURL: env.API_URL ?? 'https://dragonsofmugloar.com/api/v2',
  };
}
