import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ApplicationStatus } from '../applications/schemas/applications.schema';
import { EmailConfigService } from './config/email.config';
import { EmailTemplateService } from './email-template.service';

@Injectable()
export class EmailService {
  private readonly transporter: nodemailer.Transporter
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 1000; // 1 second

  constructor(
    private readonly emailConfigService: EmailConfigService,
    private readonly emailTemplateService: EmailTemplateService,
    private readonly logger: Logger,
  ) {
    const config = this.emailConfigService.getEmailConfig();
    this.transporter = nodemailer.createTransport(config);
  }

  async sendApplicationStatusUpdate(
    studentEmail: string,
    projectTitle: string,
    status: ApplicationStatus,
    professorName: string,
    professorNotes?: string,
  ): Promise<void> {
    const { subject, text } = this.emailTemplateService.getStatusUpdateTemplate(
      status,
      projectTitle,
      professorName,
      professorNotes,
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
        await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY));
        return this.sendEmailWithRetry(to, subject, text, retryCount + 1);
      }
      this.logger.error(`Failed to send email to ${to} after ${this.MAX_RETRIES} attempts`);
      throw error;
    }
  }

  async sendApplicationConfirmation(
    studentEmail: string,
    projectTitle: string,
    studentName: string,
  ): Promise<void> {
    const { subject, text } = this.emailTemplateService.getApplicationConfirmationTemplate(
      projectTitle,
      studentName
    );
    await this.sendEmailWithRetry(studentEmail, subject, text);
  }

  async sendProfessorNewApplication(
    professorEmail: string,
    projectTitle: string,
    studentName: string,
  ): Promise<void> {
    const { subject, text } = this.emailTemplateService.getProfessorNotificationTemplate(
      projectTitle,
      studentName
    );
    await this.sendEmailWithRetry(professorEmail, subject, text);
  }

  async sendDeadlineReminder(
    professorEmail: string,
    projectTitle: string,
    deadline: Date,
  ): Promise<void> {
    const { subject, text } = this.emailTemplateService.getDeadlineReminderTemplate(
      projectTitle,
      deadline
    );
    await this.sendEmailWithRetry(professorEmail, subject, text);
  }

  private async sendEmail(
    to: string,
    subject: string,
    text: string,
  ): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.emailConfigService.getEmailConfig().from,
        to,
        subject,
        text,
      });
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}: ${error.message}`);
      throw error;
    }
  }
}