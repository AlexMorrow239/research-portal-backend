import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApplicationStatus } from '../applications/schemas/applications.schema';
interface EmailTemplate {
  subject: string;
  text: string;
}
@Injectable()
export class EmailTemplateService {
  constructor(private readonly configService: ConfigService) {}

  getApplicationConfirmationTemplate(
    projectTitle: string,
    studentName: { firstName: string; lastName: string }, // Update type
  ): { subject: string; text: string } {
    return {
      subject: 'Research Application Confirmation',
      text: `Dear ${studentName.firstName} ${studentName.lastName},

Thank you for submitting your application for "${projectTitle}". Your application has been received and will be reviewed by the professor.

What's Next:
1. The professor will review your application
2. You will receive an email notification when there is an update to your application status
3. You can also check your application status by logging into the Research Portal

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
    trackingToken: string,
  ): { subject: string; text: string } {
    const baseUrl = this.configService.get<string>('API_URL', 'http://localhost:3000/api');
    const trackingUrl = `${baseUrl}/track/${trackingToken}`;

    return {
      subject: `New Research Application: ${projectTitle}`,
      text: `Dear Professor,

A new application has been submitted for your research opportunity, "${projectTitle}". Below is a summary of the applicant's attributes:

Name: ${studentName.firstName} ${studentName.lastName}
Major: ${studentMajor}
Year of Study: ${studentYear}
Statement of Interest: ${statement}

To review the full application, including the applicant's resume and contact information, please click here:
${trackingUrl}

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
