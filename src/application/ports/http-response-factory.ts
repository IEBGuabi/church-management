import { HttpResponse } from '@/application/ports/http-server';

export class HttpResponseFactory {
  public static ok<TBody>(body: TBody): HttpResponse {
    return this.create(200, body);
  }

  public static serviceUnavailable<TBody>(body: TBody): HttpResponse {
    return this.create(503, body);
  }

  public static internalServerError<TBody>(body: TBody): HttpResponse {
    return this.create(500, body);
  }

  private static create<TBody>(statusCode: number, body: TBody): HttpResponse {
    return { statusCode, body };
  }
}
