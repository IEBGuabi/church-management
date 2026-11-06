import dotenv from 'dotenv';
import { z } from 'zod';

export interface EnvironmentSettings {
  readonly nodeEnvironment: 'development' | 'test' | 'production';
  readonly port: number;
  readonly host: string;
  readonly databaseUrl: string;
  readonly databasePoolMax: number;
}

const environmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  HOST: z.string().min(1).default('0.0.0.0'),
  DATABASE_URL: z.string().url().startsWith('postgresql://'),
  DB_POOL_MAX: z.coerce.number().int().positive().default(10),
});

export class Environment {
  public static load(): EnvironmentSettings {
    dotenv.config();

    const result = environmentSchema.safeParse(process.env);
    if (!result.success) {
      const details = result.error.issues
        .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
        .join('\n');
      throw new Error(`Invalid environment configuration:\n${details}`);
    }

    return {
      nodeEnvironment: result.data.NODE_ENV,
      port: result.data.PORT,
      host: result.data.HOST,
      databaseUrl: result.data.DATABASE_URL,
      databasePoolMax: result.data.DB_POOL_MAX,
    };
  }
}
