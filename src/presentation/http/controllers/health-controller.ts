import { HealthCheckService, HealthStatus } from '@/application/health/health-check';
import {
  HttpRequest,
  HttpResponse,
  HttpRouteHandler,
} from '@/application/ports/http-server';
import { HttpResponseFactory } from '@/application/ports/http-response-factory';

export class HealthController implements HttpRouteHandler {
  public constructor(private readonly healthCheckService: HealthCheckService) {}

  public async handle(_request: HttpRequest): Promise<HttpResponse> {
    const report = await this.healthCheckService.check();

    const body = {
      status: report.status,
      timestamp: report.timestamp,
      checks: report.dependencies,
    };

    return report.status === HealthStatus.Healthy
      ? HttpResponseFactory.ok(body)
      : HttpResponseFactory.serviceUnavailable(body);
  }
}
