import { afterEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({
  load: vi.fn(), create: vi.fn(), start: vi.fn(), close: vi.fn(), reportError: vi.fn(), dbClose: vi.fn(),
  serviceCtor: vi.fn(), checkCtor: vi.fn(), factoryCtor: vi.fn(), createApp: vi.fn(),
}));
vi.mock('@/config/environment', () => ({ Environment: { load: mocks.load } }));
vi.mock('@/infrastructure/database/postgres-health-check', () => ({ PostgresHealthCheck: class { constructor(...args: unknown[]) { mocks.checkCtor(...args); } close = mocks.dbClose; } }));
vi.mock('@/application/health/health-check', () => ({ HealthCheckService: class { constructor(...args: unknown[]) { mocks.serviceCtor(...args); } } }));
vi.mock('@/infrastructure/http/fastify-http-server', () => ({ FastifyHttpServerFactory: class { constructor() { mocks.factoryCtor(); } } }));
vi.mock('@/presentation/http/application-factory', () => ({ HttpApplicationFactory: { createApp: mocks.createApp } }));
import { afterEach as _afterEach } from 'vitest';

describe('Application entrypoint', () => {
  afterEach(() => { vi.resetModules(); vi.clearAllMocks(); process.exitCode = 0; });
  const env = { databaseUrl: 'postgresql://localhost/db', databasePoolMax: 5, host: 'localhost', port: 3000 };
  async function run(start: unknown, close: unknown = undefined) {
    mocks.load.mockReturnValue(env);
    mocks.start.mockImplementation(() => start instanceof Error ? Promise.reject(start) : start === 'non-error' ? Promise.reject('failure') : Promise.resolve());
    mocks.close.mockImplementation(() => close instanceof Error ? Promise.reject(close) : close === 'non-error' ? Promise.reject('failure') : Promise.resolve());
    mocks.createApp.mockReturnValue({ start: mocks.start, close: mocks.close, reportError: mocks.reportError });
    await import('./main'); await new Promise(resolve => setImmediate(resolve));
  }
  it('constructs the app and starts successfully', async () => {
    await run(undefined); expect(mocks.checkCtor).toHaveBeenCalledWith(env.databaseUrl, env.databasePoolMax); expect(mocks.serviceCtor).toHaveBeenCalledOnce(); expect(mocks.createApp).toHaveBeenCalledOnce(); expect(mocks.start).toHaveBeenCalledWith({ host: env.host, port: env.port }); expect(process.exitCode).toBeUndefined();
  });
  it('reports startup failure and closes the server', async () => {
    await run(new Error('startup')); expect(mocks.reportError).toHaveBeenCalledWith(expect.objectContaining({ message: 'startup' }), 'startup'); expect(mocks.close).toHaveBeenCalledOnce(); expect(process.exitCode).toBe(1);
  });
  it('closes database when server shutdown fails with Error', async () => {
    await run(new Error('startup'), new Error('close')); expect(mocks.reportError).toHaveBeenCalledWith(expect.objectContaining({ message: 'close' }), 'shutdown'); expect(mocks.dbClose).toHaveBeenCalledOnce();
  });
  it('converts non-Error startup and shutdown failures', async () => {
    await run('non-error', 'non-error'); expect(mocks.reportError).toHaveBeenNthCalledWith(1, expect.objectContaining({ message: 'Application startup failed' }), 'startup'); expect(mocks.reportError).toHaveBeenNthCalledWith(2, expect.objectContaining({ message: 'Application shutdown failed' }), 'shutdown'); expect(mocks.dbClose).toHaveBeenCalledOnce();
  });
});
