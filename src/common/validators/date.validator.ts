/**
 * Custom date validation decorators for class-validator
 * Provides validators for future dates and date comparisons
 */

import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

/**
 * Validates that a date field is in the future (today or later)
 *
 * @param validationOptions Optional validation configuration
 * @returns PropertyDecorator for date validation
 *
 * @example
 * class Event {
 *   @IsFutureDate()
 *   eventDate: Date;
 * }
 */
export function IsFutureDate(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'isFutureDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any): boolean {
          // Ensure value is a Date object
          if (!(value instanceof Date)) {
            return false;
          }

          // Compare dates without time components
          const now = new Date();
          const dateToCheck = new Date(value);

          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          const checkDate = new Date(
            dateToCheck.getFullYear(),
            dateToCheck.getMonth(),
            dateToCheck.getDate(),
          );

          return checkDate >= today;
        },

        defaultMessage(): string {
          return '${property} must be a future date';
        },
      },
    });
  };
}

/**
 * Validates that a date field is after another specified date field
 *
 * @param property Name of the property to compare against
 * @param validationOptions Optional validation configuration
 * @returns PropertyDecorator for date comparison
 *
 * @example
 * class DateRange {
 *   @Type(() => Date)
 *   startDate: Date;
 *
 *   @Type(() => Date)
 *   @IsAfterDate('startDate')
 *   endDate: Date;
 * }
 */
export function IsAfterDate(property: string, validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'isAfterDate',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments): boolean {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];

          // Ensure both values are Date objects
          if (!(value instanceof Date) || !(relatedValue instanceof Date)) {
            return false;
          }

          // Compare dates without time components
          const compareDate = new Date(value);
          const relatedDate = new Date(relatedValue);

          compareDate.setHours(0, 0, 0, 0);
          relatedDate.setHours(0, 0, 0, 0);

          return compareDate > relatedDate;
        },

        defaultMessage(args: ValidationArguments): string {
          const [relatedPropertyName] = args.constraints;
          return `${propertyName} must be after ${relatedPropertyName}`;
        },
      },
    });
  };
}
