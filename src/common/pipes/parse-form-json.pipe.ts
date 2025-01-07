import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseFormJsonPipe implements PipeTransform {
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
