import Fastify from 'fastify';
import { describe, expect, it } from 'vitest';
import { HealthCheckService, type HealthDependency } from '../../src/application/health/health-check';
import { FastifyHttpServer } from '../../src/infrastructure/http/fastify-http-server';
import { SystemErrorTranslator } from '../../src/infrastructure/http/system-error-translator';
import { HttpApplicationFactory } from '../../src/presentation/http/application-factory';

describe('health API integration', () => {
  it('serves aggregated health over HTTP and closes dependencies', async () => {
    const healthy: HealthDependency = { name: 'postgres', check: async () => {} };
    const unavailable: HealthDependency = { name: 'mail', check: async () => { throw new Error('offline'); } };
    const app = Fastify({ logger: false });
    const server = HttpApplicationFactory.createApp({ create: () => new FastifyHttpServer(app, new SystemErrorTranslator()) }, new HealthCheckService([healthy, unavailable]), []);
    const response = await app.inject('/health');
    expect(response.statusCode).toBe(503);
    expect(response.json()).toMatchObject({ status: 'error', checks: [{ name: 'postgres', status: 'ok' }, { name: 'mail', status: 'error' }] });
    await server.close();
  });
});
