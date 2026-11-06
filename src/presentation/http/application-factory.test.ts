import { describe, expect, it, vi } from 'vitest';
import { HttpApplicationFactory } from './application-factory';
import { HealthCheckService } from '@/application/health/health-check';
import type { ApplicationCloseHandler, HttpRouteHandler, HttpServer } from '@/application/ports/http-server';

describe('HttpApplicationFactory', () => {
  it('registers the health route and every close handler on the created server', () => {
    const server: HttpServer = { registerGetRoute: vi.fn(), registerCloseHandler: vi.fn(), start: vi.fn(), close: vi.fn(), reportError: vi.fn() };
    const factory = { create: vi.fn(() => server) };
    const handlers: ApplicationCloseHandler[] = [{ close: vi.fn() }, { close: vi.fn() }];
    const result = HttpApplicationFactory.createApp(factory, new HealthCheckService([]), handlers);
    expect(result).toBe(server); expect(factory.create).toHaveBeenCalledOnce();
    expect(server.registerGetRoute).toHaveBeenCalledOnce();
    const [path, controller] = vi.mocked(server.registerGetRoute).mock.calls[0] as [string, HttpRouteHandler];
    expect(path).toBe('/health'); expect(controller).toBeDefined();
    expect(server.registerCloseHandler).toHaveBeenCalledTimes(2);
    expect(server.registerCloseHandler).toHaveBeenNthCalledWith(1, handlers[0]);
    expect(server.registerCloseHandler).toHaveBeenNthCalledWith(2, handlers[1]);
  });
});
