export class SystemError extends Error {
  public constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode: number,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = 'SystemError';
  }
}

export class UnexpectedSystemError extends SystemError {
  public constructor(message = 'An unexpected system error occurred', options?: ErrorOptions) {
    super('UNEXPECTED_SYSTEM_ERROR', message, 500, options);
    this.name = 'UnexpectedSystemError';
  }
}
