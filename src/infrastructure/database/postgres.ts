import { Pool } from 'pg';
import { env } from '@/config/env';

export const postgresPool = new Pool({
  connectionString: env.DATABASE_URL,
  max: env.DB_POOL_MAX,
});

export async function checkPostgresConnection(): Promise<void> {
  const client = await postgresPool.connect();
  try {
    await client.query('SELECT 1');
  } finally {
    client.release();
  }
}
