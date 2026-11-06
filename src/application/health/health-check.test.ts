import { describe, expect, it, vi } from 'vitest';
import { HealthCheckService, HealthStatus, type HealthDependency } from './health-check';

describe('HealthCheckService', () => {
  it('reports every dependency healthy and includes an ISO timestamp', async () => {
    const now = vi.spyOn(Date.prototype, 'toISOString').mockReturnValue('2026-01-01T00:00:00.000Z');
    const deps: HealthDependency[] = [{ name: 'db', check: vi.fn() }, { name: 'cache', check: vi.fn() }];
    await expect(new HealthCheckService(deps).check()).resolves.toEqual({ status: HealthStatus.Healthy, timestamp: '2026-01-01T00:00:00.000Z', dependencies: [{ name: 'db', status: HealthStatus.Healthy }, { name: 'cache', status: HealthStatus.Healthy }] });
    expect(deps[0].check).toHaveBeenCalledOnce(); expect(deps[1].check).toHaveBeenCalledOnce(); now.mockRestore();
  });
  it('marks rejected dependencies unhealthy while continuing the checks', async () => {
    const deps: HealthDependency[] = [{ name: 'db', check: vi.fn().mockRejectedValue(new Error()) }, { name: 'cache', check: vi.fn() }];
    const report = await new HealthCheckService(deps).check();
    expect(report.status).toBe(HealthStatus.Unhealthy);
    expect(report.dependencies).toEqual([{ name: 'db', status: HealthStatus.Unhealthy }, { name: 'cache', status: HealthStatus.Healthy }]);
  });
  it('treats an empty dependency list as healthy', async () => {
    await expect(new HealthCheckService([]).check()).resolves.toMatchObject({ status: HealthStatus.Healthy, dependencies: [] });
  });
});
