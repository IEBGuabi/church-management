export interface HttpResponse {
  readonly statusCode: number;
  readonly body: unknown;
}

export interface HttpRouteHandler {
  handle(): Promise<HttpResponse>;
}

export interface HttpServerSettings {
  readonly host: string;
  readonly port: number;
}

export interface HttpServer {
  registerGetRoute(path: string, handler: HttpRouteHandler): void;
  registerCloseHandler(handler: ApplicationCloseHandler): void;
  start(settings: HttpServerSettings): Promise<void>;
  close(): Promise<void>;
  reportError(error: Error, context: string): void;
}

export interface HttpServerFactory {
  create(): HttpServer;
}

export interface ApplicationCloseHandler {
  close(): Promise<void>;
}
