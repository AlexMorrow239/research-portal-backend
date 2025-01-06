import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseException } from '../exceptions/base.exception';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const timestamp = new Date().toISOString();

    // Get the error response
    const errorResponse = this.getErrorResponse(exception);

    // Build the error object
    const error = {
      statusCode: status,
      timestamp,
      path: request.url,
      method: request.method,
      ...errorResponse,
      requestId: request.headers['x-request-id'] || undefined,
    };

    // Log the error with additional context
    this.logError(request, error, exception);

    response.status(status).json(error);
  }

  private getErrorResponse(exception: HttpException) {
    const exceptionResponse = exception.getResponse();

    if (exception instanceof BaseException) {
      return {
        message: exceptionResponse['message'] || exceptionResponse,
        code: exception.code,
        details: exception.details,
      };
    }

    return typeof exceptionResponse === 'object'
      ? exceptionResponse
      : { message: exceptionResponse };
  }

  private logError(request: Request, error: any, exception: HttpException) {
    const errorLog = {
      ...error,
      stack: exception.stack,
      headers: request.headers,
      query: request.query,
      body: request.body,
    };

    if (error.statusCode >= 500) {
      this.logger.error(`Server Error: ${request.method} ${request.url}`, errorLog);
    } else {
      this.logger.warn(`Client Error: ${request.method} ${request.url}`, errorLog);
    }
  }
}
