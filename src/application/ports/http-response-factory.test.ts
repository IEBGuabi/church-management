import { describe, expect, it } from 'vitest';
import { HttpResponseFactory } from './http-response-factory';

describe('HttpResponseFactory', () => {
  it.each([[HttpResponseFactory.ok, 200], [HttpResponseFactory.serviceUnavailable, 503], [HttpResponseFactory.internalServerError, 500]])('creates a %i response', (makeResponse, statusCode) => {
    const body = { message: 'test' }; expect(makeResponse.call(HttpResponseFactory, body)).toEqual({ statusCode, body });
  });
});
