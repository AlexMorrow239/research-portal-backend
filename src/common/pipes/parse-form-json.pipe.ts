/**
 * Custom pipe for parsing JSON strings in form data
 * Specifically handles the 'application' field in form submissions
 * by converting JSON strings to objects
 */

import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseFormJsonPipe implements PipeTransform {
  /**
   * Transforms form data by parsing JSON strings
   * @param value The form data to transform
   * @returns Transformed form data with parsed JSON
   * @throws BadRequestException if JSON parsing fails
   */
  transform(value: any) {
    try {
      if (value.application && typeof value.application === 'string') {
        value.application = JSON.parse(value.application);
      }
      return value;
    } catch (error) {
      throw new BadRequestException('Invalid JSON format in application field');
    }
  }
}
