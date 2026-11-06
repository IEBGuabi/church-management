import { HealthCheckService } from '@/application/health/health-check';
import {
  ApplicationCloseHandler,
  HttpServer,
  HttpServerFactory,
} from '@/application/ports/http-server';
import { HealthController } from '@/presentation/http/controllers/health-controller';

export class HttpApplicationFactory {
  public static createApp(
    serverFactory: HttpServerFactory,
    healthCheckService: HealthCheckService,
    closeHandlers: ApplicationCloseHandler[],
  ): HttpServer {
    const server = serverFactory.create();
    server.registerGetRoute('/health', new HealthController(healthCheckService));
    for (const closeHandler of closeHandlers) {
      server.registerCloseHandler(closeHandler);
    }
    return server;
  }
}
