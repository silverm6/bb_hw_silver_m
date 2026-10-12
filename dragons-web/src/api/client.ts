import { createAPIClient } from 'dragons-api/client';

export const apiClient = createAPIClient({
  apiURL: 'https://dragonsofmugloar.com/api/v2',
  logger: console,
  options: { maxRetries: 0 },
});
