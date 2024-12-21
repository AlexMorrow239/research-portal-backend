import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { CreateProfessorDto } from '../dto/create-professor.dto';

@Injectable()
export class EmailDomainPipe implements PipeTransform {
  transform(value: CreateProfessorDto) {
    if (!value.email.endsWith('@miami.edu')) {
      throw new BadRequestException('Email must be a valid miami.edu address');
    }
    return value;
  }
}