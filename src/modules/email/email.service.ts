import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

import { EmailConfigService } from './config/email.config';
import { EmailTemplateService } from './email-template.service';
import { EmailTrackingService } from './email-tracking.service';
import { Application, ApplicationStatus } from '../applications/schemas/applications.schema';

@Injectable()
export class EmailService {
  private readonly transporter: nodemailer.Transporter;
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 1000; // 1 second

  constructor(
    private readonly emailConfigService: EmailConfigService,
    private readonly emailTemplateService: EmailTemplateService,
    private readonly emailTrackingService: EmailTrackingService,
    private readonly logger: Logger,
  ) {
    const config = this.emailConfigService.getEmailConfig();
    this.transporter = nodemailer.createTransport(config);
  }

  async sendApplicationConfirmation(application: Application, projectTitle: string): Promise<void> {
    const { subject, text } = this.emailTemplateService.getApplicationConfirmationTemplate(
      projectTitle,
      application.studentInfo.name,
    );

    await this.sendEmailWithRetry(application.studentInfo.email, subject, text);
  }

  async sendProfessorNewApplication(
    professorEmail: string,
    application: Application,
    projectTitle: string,
  ): Promise<void> {
    const trackingToken = await this.emailTrackingService.createTrackingToken(
      application.id,
      application.project.toString(),
    );

    const { subject, text } = this.emailTemplateService.getProfessorNotificationTemplate(
      projectTitle,
      application.studentInfo.name,
      application.studentInfo.major1,
      application.studentInfo.graduationDate.getFullYear().toString(),
      application.researchExperience.researchInterestDescription,
      trackingToken,
    );

    await this.sendEmailWithRetry(professorEmail, subject, text);
  }

  async sendApplicationStatusUpdate(
    studentEmail: string,
    projectTitle: string,
    status: ApplicationStatus,
  ): Promise<void> {
    const { subject, text } = this.emailTemplateService.getApplicationStatusUpdateTemplate(
      projectTitle,
      status,
    );

    await this.sendEmailWithRetry(studentEmail, subject, text);
  }

  private async sendEmailWithRetry(
    to: string,
    subject: string,
    text: string,
    retryCount = 0,
  ): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.emailConfigService.getEmailConfig().from,
        to,
        subject,
        text,
        replyTo: this.emailConfigService.getEmailConfig().replyTo,
      });
      this.logger.log(`Email sent successfully to ${to}`);
    } catch (error) {
      if (retryCount < this.MAX_RETRIES) {
        this.logger.warn(
          `Failed to send email to ${to}, retrying... (${retryCount + 1}/${this.MAX_RETRIES})`,
        );
        await new Promise((resolve) => setTimeout(resolve, this.RETRY_DELAY));
        return this.sendEmailWithRetry(to, subject, text, retryCount + 1);
      }
      this.logger.error(`Failed to send email to ${to} after ${this.MAX_RETRIES} attempts`);
      throw error;
    }
  }
}
