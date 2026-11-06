import { beforeEach, describe, expect, it, vi } from 'vitest';
const { connect, query, release, end } = vi.hoisted(() => ({ connect: vi.fn(), query: vi.fn(), release: vi.fn(), end: vi.fn() }));
vi.mock('pg', () => ({ Pool: class { connect = connect; end = end; } }));
import { PostgresHealthCheck } from './postgres-health-check';

describe('PostgresHealthCheck', () => {
  beforeEach(() => { vi.clearAllMocks(); connect.mockResolvedValue({ query, release }); });
  it('connects, queries and releases the client', async () => {
    const check = new PostgresHealthCheck('postgresql://localhost/db', 3);
    await check.check();
    expect(connect).toHaveBeenCalledOnce(); expect(query).toHaveBeenCalledWith('SELECT 1'); expect(release).toHaveBeenCalledOnce();
  });
  it('releases the client when the query fails', async () => {
    query.mockRejectedValueOnce(new Error('query failed'));
    await expect(new PostgresHealthCheck('postgresql://localhost/db', 3).check()).rejects.toThrow('query failed');
    expect(release).toHaveBeenCalledOnce();
  });
  it('propagates connection and close results', async () => {
    connect.mockRejectedValueOnce(new Error('connect failed'));
    await expect(new PostgresHealthCheck('postgresql://localhost/db', 3).check()).rejects.toThrow('connect failed');
    const check = new PostgresHealthCheck('postgresql://localhost/db', 3);
    await check.close(); expect(end).toHaveBeenCalledOnce();
  });
});
