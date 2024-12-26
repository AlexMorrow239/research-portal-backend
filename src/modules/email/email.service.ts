import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ApplicationStatus } from '../applications/schemas/applications.schema';
import { EmailConfigService } from './config/email.config';

@Injectable()
export class EmailService {
  private readonly transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor(
    private readonly emailConfigService: EmailConfigService,
  ) {
    const config = this.emailConfigService.getEmailConfig();
    this.transporter = nodemailer.createTransport(config);
  }

  async sendApplicationStatusUpdate(
    studentEmail: string,
    projectTitle: string,
    status: ApplicationStatus,
  ): Promise<void> {
    const subject = `Research Application Status Update: ${status}`;
    const text = `Your application for "${projectTitle}" has been ${status.toLowerCase()}.`;

    await this.sendEmail(studentEmail, subject, text);
  }

  async sendApplicationConfirmation(
    studentEmail: string,
    projectTitle: string,
  ): Promise<void> {
    const subject = 'Research Application Received';
    const text = `We have received your application for "${projectTitle}". You will be notified when there are updates to your application status.`;

    await this.sendEmail(studentEmail, subject, text);
  }

  async sendProfessorNewApplication(
    professorEmail: string,
    projectTitle: string,
    studentName: string,
  ): Promise<void> {
    const subject = 'New Research Application Received';
    const text = `A new application has been submitted by ${studentName} for your research project "${projectTitle}".`;

    await this.sendEmail(professorEmail, subject, text);
  }

  async sendDeadlineReminder(
    professorEmail: string,
    projectTitle: string,
    deadline: Date,
  ): Promise<void> {
    const subject = 'Project Application Deadline Approaching';
    const text = `The application deadline for your research project "${projectTitle}" is approaching (${deadline.toLocaleDateString()}).`;

    await this.sendEmail(professorEmail, subject, text);
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