import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function IsFutureDate(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'isFutureDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          // Remove console.log or replace with proper logging
          if (!(value instanceof Date)) {
            return false;
          }

          const now = new Date();
          const dateToCheck = new Date(value);

          // Compare only the date portions
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          const checkDate = new Date(
            dateToCheck.getFullYear(),
            dateToCheck.getMonth(),
            dateToCheck.getDate(),
          );

          // Remove console.log or replace with proper logging
          return checkDate >= today;
        },
      },
    });
  };
}

export function IsAfterDate(property: string, validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'isAfterDate',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];

          if (!(value instanceof Date) || !(relatedValue instanceof Date)) {
            return false;
          }

          const compareDate = new Date(value);
          const relatedDate = new Date(relatedValue);

          // Compare only the date portions
          compareDate.setHours(0, 0, 0, 0);
          relatedDate.setHours(0, 0, 0, 0);

          return compareDate > relatedDate;
        },
      },
    });
  };
}
