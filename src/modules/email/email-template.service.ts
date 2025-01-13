import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ApplicationStatus } from '@common/enums';

import { Application } from '@/modules/applications/schemas/applications.schema';

interface EmailTemplate {
  subject: string;
  text: string;
  html: string;
}

@Injectable()
export class EmailTemplateService {
  constructor(private readonly configService: ConfigService) {}

  private getEmailStyles(): string {
    return `
      <style>
        .email-container {
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          line-height: 1.6;
        }
        .header {
          color: #003366;
          margin-bottom: 20px;
        }
        .content {
          background-color: #ffffff;
          padding: 20px;
          border-radius: 5px;
        }
        .footer {
          margin-top: 20px;
          color: #666666;
          font-size: 14px;
          border-top: 1px solid #eeeeee;
          padding-top: 20px;
        }
        .info-section {
          margin: 15px 0;
          padding: 15px;
          background-color: #f5f5f5;
          border-radius: 4px;
        }
        .info-label {
          font-weight: bold;
          color: #003366;
          min-width: 150px;
          display: inline-block;
        }
        .button {
          display: inline-block;
          padding: 10px 20px;
          background-color: #003366;
          color: white !important;
          text-decoration: none;
          border-radius: 5px;
          margin: 10px 0;
        }
        .status-update {
          font-size: 18px;
          color: #003366;
          padding: 15px;
          background-color: #f5f5f5;
          border-radius: 4px;
          text-align: center;
          margin: 20px 0;
        }
        .warning {
          color: #721c24;
          background-color: #f8d7da;
          border: 1px solid #f5c6cb;
          padding: 15px;
          border-radius: 4px;
          margin: 20px 0;
        }
      </style>
    `;
  }

  getApplicationConfirmationTemplate(
    projectTitle: string,
    studentName: { firstName: string; lastName: string },
  ): EmailTemplate {
    const text = `Dear ${studentName.firstName} ${studentName.lastName},

Thank you for submitting your application for "${projectTitle}". Your application has been received and the professor will contact you directly if they wish to proceed with your application.

Best regards,
Research Engine Team`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          ${this.getEmailStyles()}
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h2>Application Confirmation</h2>
            </div>
            <div class="content">
              <p>Dear ${studentName.firstName} ${studentName.lastName},</p>
              <p>Thank you for submitting your application for <strong>"${projectTitle}"</strong>.</p>
              <p>Your application has been received and the professor will contact you directly if they wish to proceed with your application.</p>
            </div>
            <div class="footer">
              <p>Best regards,<br>Research Engine Team</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return { subject: 'Research Application Confirmation', text, html };
  }

  getProfessorNotificationTemplate(
    projectTitle: string,
    application: Application,
    resumeDownloadUrl: string,
  ): EmailTemplate {
    const text = `Dear Professor,
  
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
Research Engine Team`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          ${this.getEmailStyles()}
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h2>New Research Application</h2>
            </div>
            <div class="content">
              <p>A new application has been submitted for your research opportunity <strong>"${projectTitle}"</strong>.</p>
              
              <div class="info-section">
                <h3>Basic Information</h3>
                <p><span class="info-label">Name:</span> ${application.studentInfo.name.firstName} ${application.studentInfo.name.lastName}</p>
                <p><span class="info-label">Email:</span> ${application.studentInfo.email}</p>
                <p><span class="info-label">Phone:</span> ${application.studentInfo.phoneNumber}</p>
                <p><span class="info-label">C-Number:</span> ${application.studentInfo.cNumber}</p>
                <p><span class="info-label">GPA:</span> ${application.studentInfo.gpa}</p>
              </div>

              <div class="info-section">
                <h3>Academic Information</h3>
                <p><span class="info-label">Major 1:</span> ${application.studentInfo.major1} (${application.studentInfo.major1College})</p>
                ${application.studentInfo.hasAdditionalMajor ? `<p><span class="info-label">Major 2:</span> ${application.studentInfo.major2} (${application.studentInfo.major2College})</p>` : ''}
                <p><span class="info-label">Academic Standing:</span> ${application.studentInfo.academicStanding}</p>
                <p><span class="info-label">Expected Graduation:</span> ${new Date(application.studentInfo.graduationDate).toLocaleDateString()}</p>
                ${application.studentInfo.isPreHealth ? `<p><span class="info-label">Pre-Health Track:</span> ${application.studentInfo.preHealthTrack || 'Yes'}</p>` : ''}
              </div>

              <div class="info-section">
                <h3>Availability</h3>
                <p><span class="info-label">Weekly Hours:</span> ${application.availability.weeklyHours}</p>
                <p><span class="info-label">Project Length:</span> ${application.availability.desiredProjectLength}</p>
                <p><span class="info-label">Schedule:</span></p>
                <ul>
                  <li>Monday: ${application.availability.mondayAvailability}</li>
                  <li>Tuesday: ${application.availability.tuesdayAvailability}</li>
                  <li>Wednesday: ${application.availability.wednesdayAvailability}</li>
                  <li>Thursday: ${application.availability.thursdayAvailability}</li>
                  <li>Friday: ${application.availability.fridayAvailability}</li>
                </ul>
              </div>

              <div class="info-section">
                <h3>Additional Information</h3>
                <p><span class="info-label">Previous Research Experience:</span> ${application.additionalInfo.hasPrevResearchExperience ? 'Yes' : 'No'}</p>
                ${application.additionalInfo.hasPrevResearchExperience && application.additionalInfo.prevResearchExperience ? `<p><span class="info-label">Research Experience Details:</span> ${application.additionalInfo.prevResearchExperience}</p>` : ''}
                <p><span class="info-label">Statement of Interest:</span> ${application.additionalInfo.researchInterestDescription}</p>
                <p><span class="info-label">Federal Work Study:</span> ${application.additionalInfo.hasFederalWorkStudy ? 'Yes' : 'No'}</p>
                ${application.additionalInfo.speaksOtherLanguages && application.additionalInfo.additionalLanguages?.length ? `<p><span class="info-label">Additional Languages:</span> ${application.additionalInfo.additionalLanguages.join(', ')}</p>` : ''}
                <p><span class="info-label">Comfortable with Animals:</span> ${application.additionalInfo.comfortableWithAnimals ? 'Yes' : 'No'}</p>
              </div>

              <a href="${resumeDownloadUrl}" class="button">Download Resume</a>
            </div>
            <div class="footer">
              <p>Please contact the student directly if you wish to proceed with their application.</p>
              <p>If you accept a student for this position, they must complete the Self-Placement form available at <a href="https://ugr.miami.edu/research/placement/index.html" target="_blank">UGR Self-Placement Portal</a>.</p>
              <p>Best regards,<br>Research Engine Team</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return { subject: `New Research Application: ${projectTitle}`, text, html };
  }

  getProjectClosedTemplate(projectTitle: string): EmailTemplate {
    const text = `Dear Student,

The research opportunity "${projectTitle}" is no longer available. Thank you for your interest.

Best regards,
Research Engine Team`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          ${this.getEmailStyles()}
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h2>Research Opportunity Update</h2>
            </div>
            <div class="content">
              <div class="warning">
                The research opportunity "${projectTitle}" is no longer available.
              </div>
              <p>Thank you for your interest in this opportunity.</p>
            </div>
            <div class="footer">
              <p>Best regards,<br>Research Engine Team</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return { subject: `Research Opportunity No Longer Available: ${projectTitle}`, text, html };
  }

  getApplicationStatusUpdateTemplate(
    projectTitle: string,
    status: ApplicationStatus,
  ): EmailTemplate {
    const text = `Your application for "${projectTitle}" has been ${status.toLowerCase()}.`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          ${this.getEmailStyles()}
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h2>Application Status Update</h2>
            </div>
            <div class="content">
              <p>Your application for <strong>"${projectTitle}"</strong> has been updated.</p>
              <div class="status-update">
                Application Status: ${status.toLowerCase()}
              </div>
            </div>
            <div class="footer">
              <p>Best regards,<br>Research Engine Team</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return {
      subject: `Research Engine - Application Status Update for ${projectTitle}`,
      text,
      html,
    };
  }
}
