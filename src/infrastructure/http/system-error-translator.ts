import { SystemError, UnexpectedSystemError } from '@/domain/errors/system-error';

export class SystemErrorTranslator {
  public translate(error: unknown): Error {
    if (error instanceof SystemError) {
      return error;
    }
    if (error instanceof Error) {
      return new UnexpectedSystemError('An HTTP server error occurred', { cause: error });
    }
    return new UnexpectedSystemError('An unknown HTTP server error occurred');
  }
}
