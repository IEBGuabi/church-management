import Fastify from 'fastify';
import { describe, expect, it, vi } from 'vitest';
import { HttpResponseFactory } from '@/application/ports/http-response-factory';
import { HttpMethod, type HttpRouteHandler } from '@/application/ports/http-server';
import { SystemError } from '@/domain/errors/system-error';
import { FastifyHttpServer, FastifyHttpServerFactory } from './fastify-http-server';
import { SystemErrorTranslator } from './system-error-translator';

describe('FastifyHttpServer', () => {
  it('factory creates a usable Fastify server', async () => {
    const server = new FastifyHttpServerFactory().create();
    server.registerGetRoute('/factory', { handle: async () => HttpResponseFactory.ok({ ok: true }) });
    await server.start({ host: '127.0.0.1', port: 0 }); await server.close();
  });
  it('maps requests, returns handler responses and translates handler errors', async () => {
    const app = Fastify({ logger: false }); const server = new FastifyHttpServer(app, new SystemErrorTranslator());
    const handler: HttpRouteHandler = { handle: vi.fn(async request => {
      expect(request).toMatchObject({ method: HttpMethod.Get, path: '/health', headers: expect.any(Object), body: undefined });
      return HttpResponseFactory.ok({ healthy: true });
    }) };
    server.registerGetRoute('/health', handler);
    server.registerGetRoute('/broken', { handle: async () => { throw new Error('broken'); } });
    const response = await app.inject('/health'); expect(response.statusCode).toBe(200); expect(response.json()).toEqual({ healthy: true });
    const broken = await app.inject('/broken'); expect(broken.statusCode).toBe(500); expect(broken.json()).toMatchObject({ code: 'UNEXPECTED_SYSTEM_ERROR' });
    await app.close();
  });
  it('runs close handlers and translates close handler errors', async () => {
    const app = Fastify({ logger: false }); const server = new FastifyHttpServer(app, new SystemErrorTranslator());
    const close = vi.fn(); server.registerCloseHandler({ close }); await server.close(); expect(close).toHaveBeenCalledOnce();
    const failingApp = Fastify({ logger: false }); const failing = new FastifyHttpServer(failingApp, new SystemErrorTranslator());
    failing.registerCloseHandler({ close: async () => { throw new Error('close failed'); } });
    await expect(failing.close()).rejects.toThrow('An HTTP server error occurred');
  });
  it('translates listen errors and reports errors', async () => {
    const fake = { listen: vi.fn().mockRejectedValue(new Error('listen failed')), close: vi.fn().mockResolvedValue(undefined), setErrorHandler: vi.fn(), addHook: vi.fn(), get: vi.fn(), log: { error: vi.fn() } };
    const server = new FastifyHttpServer(fake as never, new SystemErrorTranslator());
    await expect(server.start({ host: 'localhost', port: 3000 })).rejects.toMatchObject({ message: 'An HTTP server error occurred' });
    server.reportError(new SystemError('X', 'x', 400), 'test');
    expect(fake.log.error).toHaveBeenCalledWith({ err: expect.any(SystemError), context: 'test' }, 'HTTP server error');
  });
  it('uses stable public error responses for system errors', async () => {
    const app = Fastify({ logger: false }); const server = new FastifyHttpServer(app, new SystemErrorTranslator());
    server.registerGetRoute('/system-error', { handle: async () => { throw new SystemError('PRIVATE', 'private', 400); } });
    const result = await app.inject('/system-error'); expect(result.statusCode).toBe(500); expect(result.json()).toEqual({ code: 'UNEXPECTED_SYSTEM_ERROR', message: 'An unexpected system error occurred' });
    await app.close();
  });
});
