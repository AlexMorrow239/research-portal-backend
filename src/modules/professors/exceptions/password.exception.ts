import { UnauthorizedException } from '@nestjs/common';

export class InvalidAdminPasswordException extends UnauthorizedException {
  constructor() {
    super('Invalid admin password. Please contact the system administrator.');
  }
}
