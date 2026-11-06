import Fastify, { FastifyInstance } from 'fastify';
import {
  ApplicationCloseHandler,
  HttpMethod,
  HttpRequest,
  HttpRouteHandler,
  HttpServer,
  HttpServerFactory,
  HttpServerSettings,
} from '@/application/ports/http-server';
import { HttpResponseFactory } from '@/application/ports/http-response-factory';
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
      const response = HttpResponseFactory.internalServerError({
        code: 'UNEXPECTED_SYSTEM_ERROR',
        message: 'An unexpected system error occurred',
      });
      return reply.code(response.statusCode).send(response.body);
    });
  }

  public registerGetRoute(path: string, handler: HttpRouteHandler): void {
    this.server.get(path, async (request, reply) => {
      try {
        const httpRequest: HttpRequest = {
          method: HttpMethod.Get,
          path: request.url,
          headers: request.headers,
          body: request.body,
        };
        const response = await handler.handle(httpRequest);
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
