export class APIError extends Error {
  readonly status: number;

  constructor(method: string, path: string, status: number) {
    super(`${method} ${path} failed with ${status}`);
    this.name = 'APIError';
    this.status = status;
  }
}
