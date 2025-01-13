import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { ApplicationStatus } from '@/common/enums';
import { ErrorHandler } from '@/common/utils/error-handler.util';
import { AnalyticsService } from '@/modules/analytics/analytics.service';

import { CreateApplicationDto } from '../../common/dto/applications/create-application.dto';

import { EmailService } from '../email/email.service';
import { FileStorageService } from '../file-storage/file-storage.service';
import { ProjectsService } from '../projects/projects.service';
import { ProjectStatus } from '../projects/schemas/projects.schema';

import { Application } from './schemas/applications.schema';

@Injectable()
export class ApplicationsService {
  private readonly logger = new Logger(ApplicationsService.name);

  constructor(
    @InjectModel(Application.name) private applicationModel: Model<Application>,
    @Inject(forwardRef(() => ProjectsService))
    private readonly projectsService: ProjectsService,
    private readonly fileStorageService: FileStorageService,
    private readonly emailService: EmailService,
    private readonly analyticsService: AnalyticsService,
  ) {}

  async create(
    projectId: string,
    createApplicationDto: CreateApplicationDto,
    resumeFile: Express.Multer.File,
  ): Promise<Application> {
    try {
      const project = await this.projectsService.findOne(projectId);

      if (project.status !== ProjectStatus.PUBLISHED) {
        throw new BadRequestException('Project is not accepting applications');
      }

      if (project.applicationDeadline && new Date() > new Date(project.applicationDeadline)) {
        throw new BadRequestException('Application deadline has passed');
      }

      const fileName = await this.fileStorageService.saveFile(resumeFile, `resumes`);

      // Create the application
      const application = await this.applicationModel.create({
        project: projectId,
        studentInfo: createApplicationDto.studentInfo,
        availability: createApplicationDto.availability,
        additionalInfo: createApplicationDto.additionalInfo,
        resumeFile: fileName,
        status: ApplicationStatus.PENDING,
      });

      // Populate the application with project and professor data
      const populatedApplication = await this.applicationModel.findById(application._id).populate({
        path: 'project',
        populate: {
          path: 'professor',
          select: 'email name department',
        },
      });

      // Send confirmation emails
      await this.emailService.sendApplicationConfirmation(populatedApplication, project.title);
      await this.emailService.sendProfessorNewApplication(
        project.professor.email,
        populatedApplication,
        project.title,
      );

      // Update analytics
      await this.analyticsService.updateApplicationMetrics(
        projectId,
        null,
        ApplicationStatus.PENDING,
      );

      return populatedApplication;
    } catch (error) {
      ErrorHandler.handleServiceError(this.logger, error, 'create application', {
        projectId,
        studentEmail: createApplicationDto.studentInfo.email,
      });
    }
  }

  async updateStatus(
    professorId: string,
    applicationId: string,
    status: ApplicationStatus,
  ): Promise<Application> {
    try {
      const application = await this.applicationModel.findById(applicationId).populate({
        path: 'project',
        populate: {
          path: 'professor',
          select: 'id email name',
        },
      });

      if (!application) {
        throw new NotFoundException('Application not found');
      }

      // Add this check to verify professor ownership
      if (application.project.professor.toString() !== professorId) {
        throw new NotFoundException('Application not found');
      }

      const oldStatus = application.status;
      const updatedApplication = await this.applicationModel
        .findByIdAndUpdate(applicationId, { status }, { new: true })
        .populate('project');

      // Update analytics for status change
      await this.analyticsService.updateApplicationMetrics(
        application.project.id,
        oldStatus,
        status,
      );

      await this.emailService.sendApplicationStatusUpdate(
        application.studentInfo.email,
        application.project.title,
        status,
      );

      this.logger.log(`Application ${applicationId} status updated to ${status}`);
      return updatedApplication;
    } catch (error) {
      ErrorHandler.handleServiceError(
        this.logger,
        error,
        'update application status',
        { applicationId, professorId, status },
        [NotFoundException],
      );
    }
  }

  async findProjectApplications(
    professorId: string,
    projectId: string,
    status?: ApplicationStatus,
  ): Promise<Application[]> {
    try {
      const project = await this.projectsService.findOne(projectId);

      if (project.professor.id.toString() !== professorId) {
        throw new NotFoundException('Project not found');
      }

      const filter: any = { project: projectId };
      if (status) {
        filter.status = status;
      }

      const applications = await this.applicationModel
        .find(filter)
        .populate('project')
        .sort({ createdAt: -1 });

      this.logger.log(`Retrieved ${applications.length} applications for project ${projectId}`);
      return applications;
    } catch (error) {
      ErrorHandler.handleServiceError(
        this.logger,
        error,
        'fetch project applications',
        { projectId, professorId, status },
        [NotFoundException],
      );
    }
  }

  async getResume(
    professorId: string,
    applicationId: string,
  ): Promise<{ file: Buffer; fileName: string; mimeType: string }> {
    try {
      const application = await this.applicationModel.findById(applicationId).populate({
        path: 'project',
        select: 'professor',
      });

      if (!application) {
        throw new NotFoundException('Application not found');
      }

      if (application.project.professor.toString() !== professorId) {
        throw new NotFoundException('Application not found');
      }

      const fileData = await this.fileStorageService.getFile(application.resumeFile);
      const mimeType = this.getMimeType(application.resumeFile);

      this.logger.log(`Resume retrieved for application ${applicationId}`);
      return {
        file: fileData.buffer,
        fileName: application.resumeFile,
        mimeType,
      };
    } catch (error) {
      ErrorHandler.handleServiceError(
        this.logger,
        error,
        'retrieve resume',
        { applicationId, professorId },
        [NotFoundException],
      );
    }
  }

  private getMimeType(fileName: string): string {
    try {
      const extension = fileName.split('.').pop()?.toLowerCase();
      switch (extension) {
        case 'pdf':
          return 'application/pdf';
        case 'doc':
          return 'application/msword';
        case 'docx':
          return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        default:
          return 'application/octet-stream';
      }
    } catch (error) {
      this.logger.error('Failed to determine mime type', {
        fileName,
        error: error.message,
      });
      return 'application/octet-stream';
    }
  }

  async closeProjectApplications(projectId: string): Promise<void> {
    try {
      this.logger.log(`Closing all pending applications for project ${projectId}`);

      const result = await this.applicationModel.updateMany(
        {
          project: projectId,
          status: ApplicationStatus.PENDING,
        },
        {
          status: ApplicationStatus.CLOSED,
        },
      );

      this.logger.log(
        `Successfully closed ${result.modifiedCount} pending applications for project ${projectId}`,
      );
    } catch (error) {
      ErrorHandler.handleServiceError(this.logger, error, 'close project applications', {
        projectId,
      });
    }
  }
}
