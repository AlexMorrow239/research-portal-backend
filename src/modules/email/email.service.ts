import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as nodemailer from 'nodemailer';

import { ApplicationStatus } from '@common/enums';

import { ErrorHandler } from '@/common/utils/error-handler.util';
import { DownloadTokenService } from '@/modules/file-storage/download-token.service';
import { DownloadUrlService } from '@/modules/file-storage/download-url.service';

import { Application } from '../applications/schemas/applications.schema';

import { EmailConfigService } from './config/email.config';
import { EmailTemplateService } from './email-template.service';

@Injectable()
export class EmailService {
  private readonly transporter: nodemailer.Transporter;
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 1000; // 1 second

  constructor(
    private readonly emailConfigService: EmailConfigService,
    private readonly emailTemplateService: EmailTemplateService,
    private readonly configService: ConfigService,
    private readonly downloadTokenService: DownloadTokenService,
    private readonly downloadUrlService: DownloadUrlService,
    private readonly logger: Logger,
  ) {
    const config = this.emailConfigService.getEmailConfig();
    this.transporter = nodemailer.createTransport(config);
  }

  async sendApplicationConfirmation(application: Application, projectTitle: string): Promise<void> {
    try {
      const { subject, text, html } = this.emailTemplateService.getApplicationConfirmationTemplate(
        projectTitle,
        application.studentInfo.name,
      );

      await this.sendEmailWithRetry(application.studentInfo.email, subject, text, html);
    } catch (error) {
      ErrorHandler.handleServiceError(this.logger, error, 'send application confirmation', {
        applicationId: application.id,
        projectTitle,
      });
    }
  }

  async sendProfessorNewApplication(
    professorEmail: string,
    application: Application,
    projectTitle: string,
  ): Promise<void> {
    try {
      const projectId = application.project._id || application.project;
      const professorId = application.project.professor._id || application.project.professor;

      const resumeDownloadUrl = this.getResumeDownloadUrl(projectId, application.id, professorId);

      const { subject, text, html } = this.emailTemplateService.getProfessorNotificationTemplate(
        projectTitle,
        application,
        resumeDownloadUrl,
      );

      await this.sendEmailWithRetry(professorEmail, subject, text, html);
    } catch (error) {
      ErrorHandler.handleServiceError(
        this.logger,
        error,
        'send professor new application notification',
        { applicationId: application.id, professorEmail, projectTitle },
      );
    }
  }

  private getResumeDownloadUrl(
    projectId: string,
    applicationId: string,
    professorId: string,
  ): string {
    return this.downloadUrlService.generateDownloadUrl(projectId, applicationId, professorId);
  }

  async sendApplicationStatusUpdate(
    studentEmail: string,
    projectTitle: string,
    status: ApplicationStatus,
  ): Promise<void> {
    try {
      const { subject, text, html } = this.emailTemplateService.getApplicationStatusUpdateTemplate(
        projectTitle,
        status,
      );

      await this.sendEmailWithRetry(studentEmail, subject, text, html);
    } catch (error) {
      ErrorHandler.handleServiceError(this.logger, error, 'send application status update', {
        studentEmail,
        projectTitle,
        status,
      });
    }
  }

  private async sendEmailWithRetry(
    to: string,
    subject: string,
    text: string,
    html: string,
    retryCount = 0,
  ): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.emailConfigService.getEmailConfig().from,
        to,
        subject,
        text, // Plain text version
        html, // HTML version
        replyTo: this.emailConfigService.getEmailConfig().replyTo,
      });
      this.logger.log(`Email sent successfully to ${to}`);
    } catch (error) {
      if (retryCount < this.MAX_RETRIES) {
        this.logger.warn(
          `Failed to send email to ${to}, retrying... (${retryCount + 1}/${this.MAX_RETRIES})`,
        );
        await new Promise((resolve) => setTimeout(resolve, this.RETRY_DELAY));
        return this.sendEmailWithRetry(to, subject, text, html, retryCount + 1);
      }

      ErrorHandler.handleServiceError(this.logger, error, 'send email', {
        to,
        subject,
        retryCount,
      });
    }
  }

  async sendProjectClosedNotification(studentEmail: string, projectTitle: string): Promise<void> {
    try {
      const { subject, text, html } =
        this.emailTemplateService.getProjectClosedTemplate(projectTitle);

      await this.sendEmailWithRetry(studentEmail, subject, text, html);
    } catch (error) {
      ErrorHandler.handleServiceError(this.logger, error, 'send project closed notification', {
        studentEmail,
        projectTitle,
      });
    }
  }
}
