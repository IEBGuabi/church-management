import Fastify from 'fastify';
import { env } from '@/config/env';
import { checkPostgresConnection, postgresPool } from '@/infrastructure/database/postgres';

export function createApp() {
  const app = Fastify({ logger: true });

  app.get('/health', async (_request, reply) => {
    const checks: Record<string, 'ok' | 'error'> = { postgres: 'ok' };
    try {
      await checkPostgresConnection();
      // Register future dependency checks in this object as integrations are added.
    } catch (error) {
      checks.postgres = 'error';
      app.log.error({ err: error }, 'PostgreSQL health check failed');
    }

    const healthy = Object.values(checks).every((status) => status === 'ok');
    return reply.code(healthy ? 200 : 503).send({
      status: healthy ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      checks,
    });
  });

  app.addHook('onClose', async () => {
    await postgresPool.end();
  });

  return app;
}

export async function startServer(): Promise<void> {
  const app = createApp();
  try {
    await app.listen({ port: env.PORT, host: env.HOST });
  } catch (error) {
    app.log.error(error);
    await app.close();
    process.exitCode = 1;
  }
}
