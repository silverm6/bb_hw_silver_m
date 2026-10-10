import { afterAll, afterEach, beforeAll } from 'bun:test';

import { server } from './server.ts';

export function setupMockServer() {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' });
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });
}
