import { describe, expect, it } from 'vitest';
import { SystemError, UnexpectedSystemError } from './system-error';

describe('system errors', () => {
  it('preserves system error metadata and cause', () => {
    const cause = new Error('cause');
    const error = new SystemError('CUSTOM', 'message', 418, { cause });
    expect(error).toMatchObject({ name: 'SystemError', code: 'CUSTOM', message: 'message', statusCode: 418, cause });
    expect(error).toBeInstanceOf(Error);
  });
  it('uses defaults for unexpected errors and supports overrides', () => {
    const defaultError = new UnexpectedSystemError();
    expect(defaultError).toMatchObject({ name: 'UnexpectedSystemError', code: 'UNEXPECTED_SYSTEM_ERROR', message: 'An unexpected system error occurred', statusCode: 500 });
    expect(new UnexpectedSystemError('custom')).toMatchObject({ message: 'custom', statusCode: 500 });
  });
});
