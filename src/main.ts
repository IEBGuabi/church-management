import { HealthCheckService } from '@/application/health/health-check';
import { Environment } from '@/config/environment';
import { UnexpectedSystemError } from '@/domain/errors/system-error';
import { PostgresHealthCheck } from '@/infrastructure/database/postgres-health-check';
import { FastifyHttpServerFactory } from '@/infrastructure/http/fastify-http-server';
import { HttpApplicationFactory } from '@/presentation/http/application-factory';

export class Application {
  public static async start(): Promise<void> {
    const settings = Environment.load();
    const databaseHealthCheck = new PostgresHealthCheck(
      settings.databaseUrl,
      settings.databasePoolMax,
    );
    const healthCheckService = new HealthCheckService([databaseHealthCheck]);
    const server = HttpApplicationFactory.createApp(
      new FastifyHttpServerFactory(),
      healthCheckService,
      [databaseHealthCheck],
    );

    try {
      await server.start({ host: settings.host, port: settings.port });
    } catch (error) {
      const systemError = error instanceof Error
        ? error
        : new UnexpectedSystemError('Application startup failed');
      server.reportError(systemError, 'startup');
      try {
        await server.close();
      } catch (closeError) {
        const closeSystemError = closeError instanceof Error
          ? closeError
          : new UnexpectedSystemError('Application shutdown failed');
        server.reportError(closeSystemError, 'shutdown');
        await databaseHealthCheck.close();
      }
      process.exitCode = 1;
    }
  }
}

void Application.start();
