import { BadRequestException } from '@nestjs/common';

export class InvalidPasswordFormatException extends BadRequestException {
  constructor(missingRequirements: string[]) {
    super({
      statusCode: 400,
      error: 'Invalid Password Format',
      message: 'Password does not meet security requirements',
      rules: {
        required: [
          'Minimum 8 characters',
          'At least one uppercase letter',
          'At least one lowercase letter',
          'At least one number',
          'At least one special character (!@#$%^&*(),.?":{}|<>)',
        ],
        missing: missingRequirements,
        example: 'Research2024!',
      },
    });
  }
}
