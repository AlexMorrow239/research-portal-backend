/**
 * Custom exceptions for application-related errors
 * Provides specific error types for different application scenarios
 */

import { HttpStatus } from '@nestjs/common';

import { BaseException } from './base.exception';

/**
 * Thrown when attempting to submit an application after the deadline
 */
export class ApplicationDeadlinePassedException extends BaseException {
  constructor(deadline: Date) {
    super(
      {
        message: 'Application deadline has passed',
        details: { deadline: deadline.toISOString() },
      },
      HttpStatus.BAD_REQUEST,
      'APPLICATION_DEADLINE_PASSED',
    );
  }
}

/**
 * Thrown when attempting to access a non-existent application
 */
export class ApplicationNotFoundException extends BaseException {
  constructor(applicationId: string) {
    super(
      {
        message: 'Application not found',
        details: { applicationId },
      },
      HttpStatus.NOT_FOUND,
      'APPLICATION_NOT_FOUND',
    );
  }
}

/**
 * Thrown when attempting to upload a file with an unsupported format
 */
export class InvalidFileTypeException extends BaseException {
  constructor(allowedTypes: string[]) {
    super(
      {
        message: 'Invalid file type',
        details: { allowedTypes },
      },
      HttpStatus.BAD_REQUEST,
      'INVALID_FILE_TYPE',
    );
  }
}
