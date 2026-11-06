import Fastify, { FastifyInstance } from 'fastify';
import { ApplicationCloseHandler, HttpRouteHandler, HttpServer, HttpServerFactory, HttpServerSettings } from '@/application/ports/http-server';
import { SystemErrorTranslator } from '@/infrastructure/http/system-error-translator';

export class FastifyHttpServerFactory implements HttpServerFactory {
  public create(): HttpServer {
    return new FastifyHttpServer(Fastify({ logger: true }), new SystemErrorTranslator());
  }
}

export class FastifyHttpServer implements HttpServer {
  public constructor(
    private readonly server: FastifyInstance,
    private readonly errorTranslator: SystemErrorTranslator,
  ) {
    this.server.setErrorHandler((error, _request, reply) => {
      const systemError = this.errorTranslator.translate(error);
      this.reportError(systemError, 'request');
      return reply.code(500).send({
        code: 'UNEXPECTED_SYSTEM_ERROR',
        message: 'An unexpected system error occurred',
      });
    });
  }

  public registerGetRoute(path: string, handler: HttpRouteHandler): void {
    this.server.get(path, async (_request, reply) => {
      try {
        const response = await handler.handle();
        return reply.code(response.statusCode).send(response.body);
      } catch (error) {
        throw this.errorTranslator.translate(error);
      }
    });
  }

  public registerCloseHandler(handler: ApplicationCloseHandler): void {
    this.server.addHook('onClose', async () => {
      try {
        await handler.close();
      } catch (error) {
        throw this.errorTranslator.translate(error);
      }
    });
  }

  public async start(settings: HttpServerSettings): Promise<void> {
    try {
      await this.server.listen({ port: settings.port, host: settings.host });
    } catch (error) {
      throw this.errorTranslator.translate(error);
    }
  }

  public async close(): Promise<void> {
    try {
      await this.server.close();
    } catch (error) {
      throw this.errorTranslator.translate(error);
    }
  }

  public reportError(error: Error, context: string): void {
    this.server.log.error({ err: error, context }, 'HTTP server error');
  }
}
