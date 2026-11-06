import { HealthCheckService } from '@/application/health/health-check';
import {
  ApplicationCloseHandler,
  HttpServer,
  HttpServerFactory,
} from '@/application/ports/http-server';
import { HealthRoute } from '@/presentation/http/health-route';

export class HttpApplicationFactory {
  public static createApp(
    serverFactory: HttpServerFactory,
    healthCheckService: HealthCheckService,
    closeHandlers: ApplicationCloseHandler[],
  ): HttpServer {
    const server = serverFactory.create();
    server.registerGetRoute('/health', new HealthRoute(healthCheckService));
    for (const closeHandler of closeHandlers) {
      server.registerCloseHandler(closeHandler);
    }
    return server;
  }
}
