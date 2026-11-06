import { describe, expect, it, vi } from 'vitest';
import { HealthCheckService, HealthStatus } from '@/application/health/health-check';
import type { HttpRequest } from '@/application/ports/http-server';
import { HealthController } from './health-controller';

describe('HealthController', () => {
  const request = {} as HttpRequest;
  it('returns HTTP 200 for a healthy report', async () => {
    const service = { check: vi.fn().mockResolvedValue({ status: HealthStatus.Healthy, timestamp: 'now', dependencies: [] }) } as unknown as HealthCheckService;
    await expect(new HealthController(service).handle(request)).resolves.toEqual({ statusCode: 200, body: { status: 'ok', timestamp: 'now', checks: [] } });
  });
  it('returns HTTP 503 for an unhealthy report', async () => {
    const service = { check: vi.fn().mockResolvedValue({ status: HealthStatus.Unhealthy, timestamp: 'now', dependencies: [{ name: 'db', status: 'error' }] }) } as unknown as HealthCheckService;
    await expect(new HealthController(service).handle(request)).resolves.toEqual({ statusCode: 503, body: { status: 'error', timestamp: 'now', checks: [{ name: 'db', status: 'error' }] } });
  });
});
