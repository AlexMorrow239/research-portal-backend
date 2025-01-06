import { HttpStatus } from '@nestjs/common';

import { BaseException } from './base.exception';

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
