import { BadRequestException } from '@nestjs/common';

export class InvalidEmailDomainException extends BadRequestException {
  constructor() {
    super('Email must be a valid miami.edu address');
  }
}
