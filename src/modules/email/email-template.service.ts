import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ApplicationStatus } from '@common/enums';

import { Application } from '@/modules/applications/schemas/applications.schema';
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
    application: Application,
    resumeDownloadUrl: string,
  ): { subject: string; text: string } {
    return {
      subject: `New Research Application: ${projectTitle}`,
      text: `Dear Professor,
  
A new application has been submitted for your research opportunity "${projectTitle}". Below is the applicant's information:

Basic Information:
- Name: ${application.studentInfo.name.firstName} ${application.studentInfo.name.lastName}
- Email: ${application.studentInfo.email}
- Phone: ${application.studentInfo.phoneNumber}
- C-Number: ${application.studentInfo.cNumber}
- GPA: ${application.studentInfo.gpa}

Academic Information:
- Major 1: ${application.studentInfo.major1} (${application.studentInfo.major1College})
${application.studentInfo.hasAdditionalMajor ? `- Major 2: ${application.studentInfo.major2} (${application.studentInfo.major2College})\n` : ''}- Academic Standing: ${application.studentInfo.academicStanding}
- Expected Graduation: ${new Date(application.studentInfo.graduationDate).toLocaleDateString()}
${application.studentInfo.isPreHealth ? `- Pre-Health Track: ${application.studentInfo.preHealthTrack || 'Yes'}\n` : ''}
Availability:
- Monday: ${application.availability.mondayAvailability}
- Tuesday: ${application.availability.tuesdayAvailability}
- Wednesday: ${application.availability.wednesdayAvailability}
- Thursday: ${application.availability.thursdayAvailability}
- Friday: ${application.availability.fridayAvailability}
- Weekly Hours: ${application.availability.weeklyHours}
- Desired Project Length: ${application.availability.desiredProjectLength}

Additional Information:
- Previous Research Experience: ${application.additionalInfo.hasPrevResearchExperience ? 'Yes' : 'No'}
${application.additionalInfo.hasPrevResearchExperience && application.additionalInfo.prevResearchExperience ? `- Research Experience Details: ${application.additionalInfo.prevResearchExperience}\n` : ''}- Statement of Interest: ${application.additionalInfo.researchInterestDescription}
- Federal Work Study: ${application.additionalInfo.hasFederalWorkStudy ? 'Yes' : 'No'}
${application.additionalInfo.speaksOtherLanguages && application.additionalInfo.additionalLanguages?.length ? `- Additional Languages: ${application.additionalInfo.additionalLanguages.join(', ')}\n` : ''}- Comfortable with Animals: ${application.additionalInfo.comfortableWithAnimals ? 'Yes' : 'No'}

Resume: ${resumeDownloadUrl}

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
