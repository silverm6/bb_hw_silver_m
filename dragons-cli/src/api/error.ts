export class APIError extends Error {
  readonly status: number;
  readonly body: string;

  constructor(status: number, body: string) {
    super(`API request failed with ${status}`);
    this.name = "APIError";
    this.status = status;
    this.body = body;
  }
}
