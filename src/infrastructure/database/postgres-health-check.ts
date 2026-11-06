import { Pool } from 'pg';
import { HealthDependency } from '@/application/health/health-check';
import { ApplicationCloseHandler } from '@/application/ports/http-server';

export class PostgresHealthCheck implements HealthDependency, ApplicationCloseHandler {
  public readonly name = 'postgres';
  private readonly pool: Pool;

  public constructor(connectionString: string, maxConnections: number) {
    this.pool = new Pool({ connectionString, max: maxConnections });
  }

  public async check(): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query('SELECT 1');
    } finally {
      client.release();
    }
  }

  public async close(): Promise<void> {
    await this.pool.end();
  }
}
