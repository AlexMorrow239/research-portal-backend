import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

import { CreateProfessorDto } from '../../../common/dto/professors/create-professor.dto';

@Injectable()
export class EmailDomainPipe implements PipeTransform {
  transform(value: CreateProfessorDto) {
    const validDomains = [
      '@miami.edu',
      '@med.miami.edu',
      '@cd.miami.edu',
      // Add other valid Miami domains as needed
    ];

    if (!validDomains.some((domain) => value.email.endsWith(domain))) {
      throw new BadRequestException('Email must be a valid University of Miami address');
    }
    return value;
  }
}
