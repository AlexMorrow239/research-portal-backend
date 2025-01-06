import { InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';

export class ErrorHandler {
  static handleServiceError(
    logger: Logger,
    error: any,
    context: string,
    details?: Record<string, any>,
    knownErrors: any[] = [NotFoundException],
  ) {
    // If error is a known type, rethrow it
    if (knownErrors.some((errorType) => error instanceof errorType)) {
      throw error;
    }

    // Log the error with details
    logger.error(`Failed to ${context}`, {
      ...details,
      error: error.message,
      stack: error.stack,
    });

    // Throw internal server error
    throw new InternalServerErrorException(`Failed to ${context}`);
  }
}
