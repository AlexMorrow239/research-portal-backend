/**
 * Utility class for standardized error handling across services
 * Provides centralized error processing, logging, and transformation
 */

import { InternalServerErrorException, Logger, NotFoundException, Type } from '@nestjs/common';

export class ErrorHandler {
  /**
   * Handles service-level errors with consistent logging and error transformation
   *
   * @param logger NestJS logger instance for error logging
   * @param error The caught error
   * @param context Description of the operation that failed
   * @param details Additional error context details
   * @param knownErrors Array of error types that should be rethrown without transformation
   * @throws The original error if it's in knownErrors, otherwise an InternalServerErrorException
   *
   * @example
   * try {
   *   await this.userService.updateUser(userId, data);
   * } catch (error) {
   *   ErrorHandler.handleServiceError(
   *     this.logger,
   *     error,
   *     'update user',
   *     { userId, data },
   *     [NotFoundException, ConflictException]
   *   );
   * }
   */
  static handleServiceError(
    logger: Logger,
    error: Error,
    context: string,
    details?: Record<string, any>,
    knownErrors: Type<Error>[] = [NotFoundException],
  ): never {
    // Check if error is a known type that should be rethrown
    if (knownErrors.some((errorType) => error instanceof errorType)) {
      throw error;
    }

    // Log the error with context and details
    logger.error(
      `Failed to ${context}`,
      {
        ...details,
        error: error.message,
        stack: error.stack,
      },
      error.constructor.name,
    );

    // Transform unknown errors to InternalServerError
    throw new InternalServerErrorException(`Failed to ${context}`);
  }
}
