import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ApplicationStatus } from '@common/enums';
interface EmailTemplate {
  subject: string;
  text: string;
}
@Injectable()
export class EmailTemplateService {
  constructor(private readonly configService: ConfigService) {}
  getApplicationConfirmationTemplate(
    projectTitle: string,
    studentName: { firstName: string; lastName: string },
  ): { subject: string; text: string } {
    return {
      subject: 'Research Application Confirmation',
      text: `Dear ${studentName.firstName} ${studentName.lastName},

Thank you for submitting your application for "${projectTitle}". Your application has been received and the professor will contact you directly if they wish to proceed with your application.

Best regards,
Research Portal Team`,
    };
  }

  getProfessorNotificationTemplate(
    projectTitle: string,
    studentName: { firstName: string; lastName: string },
    studentMajor: string,
    studentYear: string,
    statement: string,
    studentEmail: string,
    studentPhone: string,
  ): { subject: string; text: string } {
    return {
      subject: `New Research Application: ${projectTitle}`,
      text: `Dear Professor,

A new application has been submitted for your research opportunity "${projectTitle}". Below is the applicant's information:

Name: ${studentName.firstName} ${studentName.lastName}
Email: ${studentEmail}
Phone: ${studentPhone}
Major: ${studentMajor}
Year of Study: ${studentYear}
Statement of Interest: ${statement}

Please contact the student directly if you wish to proceed with their application.

Best regards,
Research Portal Team`,
    };
  }

  getProjectClosedTemplate(projectTitle: string): { subject: string; text: string } {
    return {
      subject: `Research Opportunity No Longer Available: ${projectTitle}`,
      text: `Dear Student,

The research opportunity "${projectTitle}" is no longer available. Thank you for your interest.

Best regards,
Research Portal Team`,
    };
  }

  getApplicationStatusUpdateTemplate(
    projectTitle: string,
    status: ApplicationStatus,
  ): EmailTemplate {
    return {
      subject: `Research Portal - Application Status Update for ${projectTitle}`,
      text: `Your application for "${projectTitle}" has been ${status.toLowerCase()}.`,
    };
  }
}
