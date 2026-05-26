export type LlmErrorStatus = 502 | 503 | 504;

export class LlmError extends Error {
  readonly status: LlmErrorStatus;

  constructor(status: LlmErrorStatus, message: string) {
    super(message);
    this.name = 'LlmError';
    this.status = status;
  }
}

export function isLlmError(err: unknown): err is LlmError {
  return err instanceof LlmError;
}
