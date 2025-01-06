import { HttpException } from '@nestjs/common';

export class BaseException extends HttpException {
  constructor(
    response: string | Record<string, any>,
    status: number,
    public readonly code?: string,
    public readonly details?: Record<string, any>,
  ) {
    super(response, status);
  }
}
