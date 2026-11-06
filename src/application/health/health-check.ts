export interface HealthDependency {
  readonly name: string;
  check(): Promise<void>;
}

export enum HealthStatus {
  Healthy = 'ok',
  Unhealthy = 'error',
}

export interface HealthDependencyResult {
  readonly name: string;
  readonly status: HealthStatus;
}

export interface HealthReport {
  readonly status: HealthStatus;
  readonly timestamp: string;
  readonly dependencies: HealthDependencyResult[];
}

export class HealthCheckService {
  public constructor(private readonly dependencies: HealthDependency[]) {}

  public async check(): Promise<HealthReport> {
    const results: HealthDependencyResult[] = [];

    for (const dependency of this.dependencies) {
      try {
        await dependency.check();
        results.push({ name: dependency.name, status: HealthStatus.Healthy });
      } catch {
        results.push({ name: dependency.name, status: HealthStatus.Unhealthy });
      }
    }

    const isHealthy = results.every((result) => result.status === HealthStatus.Healthy);
    return {
      status: isHealthy ? HealthStatus.Healthy : HealthStatus.Unhealthy,
      timestamp: new Date().toISOString(),
      dependencies: results,
    };
  }
}
