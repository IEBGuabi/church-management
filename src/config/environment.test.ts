import { describe, expect, it, vi } from 'vitest';
import { Environment } from './environment';

const valid = {
  NODE_ENV: 'test', PORT: '4321', HOST: '127.0.0.1',
  DATABASE_URL: 'postgresql://user:pass@localhost:5432/db', DB_POOL_MAX: '4',
};

function withEnv(values: Record<string, string | undefined>, run: () => void) {
  const original = { ...process.env };
  for (const key of ['NODE_ENV', 'PORT', 'HOST', 'DATABASE_URL', 'DB_POOL_MAX']) delete process.env[key];
  Object.assign(process.env, values);
  try { run(); } finally { process.env = original; }
}

describe('Environment.load', () => {
  it('loads configured values and applies defaults', () => {
    withEnv({ DATABASE_URL: valid.DATABASE_URL }, () => {
      expect(Environment.load()).toEqual({ nodeEnvironment: 'development', port: 3000, host: '0.0.0.0', databaseUrl: valid.DATABASE_URL, databasePoolMax: 10 });
    });
  });
  it('loads valid overrides', () => withEnv(valid, () => {
    expect(Environment.load()).toEqual({ nodeEnvironment: 'test', port: 4321, host: '127.0.0.1', databaseUrl: valid.DATABASE_URL, databasePoolMax: 4 });
  }));
  it.each([
    [{ ...valid, NODE_ENV: 'invalid' }, 'NODE_ENV'],
    [{ ...valid, PORT: '0' }, 'PORT'],
    [{ ...valid, PORT: '65536' }, 'PORT'],
    [{ ...valid, PORT: 'nope' }, 'PORT'],
    [{ ...valid, HOST: '' }, 'HOST'],
    [{ ...valid, DATABASE_URL: 'http://localhost/db' }, 'DATABASE_URL'],
    [{ ...valid, DATABASE_URL: 'postgresql://bad space' }, 'DATABASE_URL'],
    [{ ...valid, DB_POOL_MAX: '0' }, 'DB_POOL_MAX'],
    [{ ...valid, DB_POOL_MAX: '1.5' }, 'DB_POOL_MAX'],
  ])('rejects invalid configuration at %s', (env, key) => withEnv(env as Record<string, string>, () => {
    expect(() => Environment.load()).toThrow(`Invalid environment configuration:\n${key}`);
  }));
});
