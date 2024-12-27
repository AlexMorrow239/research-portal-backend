import { Injectable } from '@nestjs/common';

import { ApplicationStatus } from '../applications/schemas/applications.schema';

@Injectable()
export class EmailTemplateService {
  getStatusUpdateTemplate(
    status: ApplicationStatus,
    projectTitle: string,
    professorName: string,
    professorNotes?: string,
  ): { subject: string; text: string } {
    const baseSubject = `Research Application Status Update: ${status}`;
    let text = '';

    switch (status) {
      case ApplicationStatus.ACCEPTED:
        text = this.getAcceptanceTemplate(projectTitle, professorName, professorNotes);
        break;
      case ApplicationStatus.REJECTED:
        text = this.getRejectionTemplate(projectTitle, professorName, professorNotes);
        break;
      default:
        text = this.getDefaultTemplate(status, projectTitle, professorName, professorNotes);
    }

    return { subject: baseSubject, text };
  }

  private getAcceptanceTemplate(
    projectTitle: string,
    professorName: string,
    notes?: string,
  ): string {
    return `Dear Student,

Congratulations! Your application for "${projectTitle}" has been ACCEPTED by Professor ${professorName}.

${notes ? `Professor's Feedback:\n${notes}\n\n` : ''}
Next Steps:
1. Please reply to this email to confirm your acceptance
2. Complete any required safety training
3. Schedule an initial meeting with your professor

Best regards,
Research Portal Team`;
  }

  private getRejectionTemplate(
    projectTitle: string,
    professorName: string,
    notes?: string,
  ): string {
    return `Dear Student,

We regret to inform you that your application for "${projectTitle}" was not accepted at this time.

${notes ? `Professor's Feedback:\n${notes}\n\n` : ''}
We encourage you to:
- Review other available research opportunities
- Consider applying for future projects
- Contact the department for additional guidance

Best regards,
Research Portal Team`;
  }

  private getDefaultTemplate(
    status: ApplicationStatus,
    projectTitle: string,
    professorName: string,
    notes?: string,
  ): string {
    return `Dear Student,

Your application for "${projectTitle}" has been updated to: ${status}

${notes ? `Additional Notes:\n${notes}\n\n` : ''}

Best regards,
Research Portal Team`;
  }

  getApplicationConfirmationTemplate(
    projectTitle: string,
    studentName: string,
  ): { subject: string; text: string } {
    return {
      subject: 'Research Application Received',
      text: `Dear ${studentName},

Thank you for submitting your application for "${projectTitle}".

What's Next:
1. Your application is now under review
2. You will receive updates about your application status
3. Please monitor your email for further communications

Best regards,
Research Portal Team`,
    };
  }

  getProfessorNotificationTemplate(
    projectTitle: string,
    studentName: string,
  ): { subject: string; text: string } {
    return {
      subject: 'New Research Application Received',
      text: `Dear Professor,
  
  A new application has been submitted for your research project "${projectTitle}".
  
  Applicant: ${studentName}
  
  You can review this application through the Research Portal.
  
  Best regards,
  Research Portal Team`,
    };
  }

  getDeadlineReminderTemplate(
    projectTitle: string,
    deadline: Date,
  ): { subject: string; text: string } {
    return {
      subject: 'Project Application Deadline Approaching',
      text: `Dear Professor,
  
  The application deadline for your research project "${projectTitle}" is approaching (${deadline.toLocaleDateString()}).
  
  Please ensure to review any pending applications before the deadline.
  
  Best regards,
  Research Portal Team`,
    };
  }
}
