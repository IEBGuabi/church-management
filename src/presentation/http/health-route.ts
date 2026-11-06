import { HealthCheckService, HealthStatus } from '@/application/health/health-check';
import { HttpResponse, HttpRouteHandler } from '@/application/ports/http-server';

export class HealthRoute implements HttpRouteHandler {
  public constructor(private readonly healthCheckService: HealthCheckService) {}

  public async handle(): Promise<HttpResponse> {
    const report = await this.healthCheckService.check();
    return {
      statusCode: report.status === HealthStatus.Healthy ? 200 : 503,
      body: {
        status: report.status,
        timestamp: report.timestamp,
        checks: report.dependencies,
      },
    };
  }
}
