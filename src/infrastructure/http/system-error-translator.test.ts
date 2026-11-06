import { describe, expect, it } from 'vitest';
import { SystemError, UnexpectedSystemError } from '@/domain/errors/system-error';
import { SystemErrorTranslator } from './system-error-translator';

describe('SystemErrorTranslator', () => {
  const translator = new SystemErrorTranslator();
  it('returns existing system errors unchanged', () => { const error = new SystemError('X', 'x', 400); expect(translator.translate(error)).toBe(error); });
  it('wraps Error values and preserves their cause', () => { const cause = new Error('boom'); const result = translator.translate(cause); expect(result).toBeInstanceOf(UnexpectedSystemError); expect(result.cause).toBe(cause); expect(result.message).toBe('An HTTP server error occurred'); });
  it('handles non-Error values', () => { expect(translator.translate('boom')).toMatchObject({ name: 'UnexpectedSystemError', message: 'An unknown HTTP server error occurred' }); });
});
