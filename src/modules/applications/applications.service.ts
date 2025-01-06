import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ApplicationStatus } from '@/common/enums';

import { Application } from './schemas/applications.schema';
import { CreateApplicationDto } from '../../common/dto/applications/create-application.dto';
import { EmailService } from '../email/email.service';
import { FileStorageService } from '../file-storage/file-storage.service';
import { ProjectsService } from '../projects/projects.service';
import { ProjectStatus } from '../projects/schemas/projects.schema';

@Injectable()
export class ApplicationsService {
  private readonly logger = new Logger(ApplicationsService.name);

  constructor(
    @InjectModel(Application.name) private applicationModel: Model<Application>,
    private readonly projectsService: ProjectsService,
    private readonly fileStorageService: FileStorageService,
    private readonly emailService: EmailService,
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

      const application = await this.applicationModel.create({
        project: projectId,
        studentInfo: createApplicationDto.studentInfo,
        availability: createApplicationDto.availability,
        additionalInfo: createApplicationDto.additionalInfo,
        resumeFile: fileName,
        status: ApplicationStatus.PENDING,
      });

      // Send confirmation email to student
      await this.emailService.sendApplicationConfirmation(application, project.title);

      // Send notification email to professor
      await this.emailService.sendProfessorNewApplication(
        project.professor.email,
        application,
        project.title,
      );

      this.logger.log(`Application created successfully for project ${projectId}`);
      return application;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }

      this.logger.error('Failed to create application', {
        projectId,
        studentEmail: createApplicationDto.studentInfo.email,
        error: error.message,
        stack: error.stack,
      });
      throw new InternalServerErrorException('Failed to create application');
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

      if (!application.project || !application.project.professor) {
        this.logger.error('Project or professor not properly populated:', {
          applicationId,
          hasProject: !!application.project,
          hasProfessor: !!application.project?.professor,
        });
        throw new NotFoundException('Application project details not found');
      }

      const projectProfessorId = application.project.professor.id?.toString();

      if (projectProfessorId !== professorId) {
        throw new NotFoundException('Application not found');
      }

      const updatedApplication = await this.applicationModel
        .findByIdAndUpdate(applicationId, { status }, { new: true })
        .populate('project');

      // Send status update email to student
      await this.emailService.sendApplicationStatusUpdate(
        application.studentInfo.email,
        application.project.title,
        status,
      );

      this.logger.log(`Application ${applicationId} status updated to ${status}`);
      return updatedApplication;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.logger.error('Failed to update application status', {
        applicationId,
        professorId,
        status,
        error: error.message,
        stack: error.stack,
      });
      throw new InternalServerErrorException('Failed to update application status');
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
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.logger.error('Failed to fetch project applications', {
        projectId,
        professorId,
        status,
        error: error.message,
        stack: error.stack,
      });
      throw new InternalServerErrorException('Failed to fetch applications');
    }
  }

  async getResume(
    professorId: string,
    applicationId: string,
  ): Promise<{
    file: Buffer;
    fileName: string;
    mimeType: string;
  }> {
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

      try {
        const fileData = await this.fileStorageService.getFile(application.resumeFile);
        const mimeType = this.getMimeType(application.resumeFile);

        this.logger.log(`Resume retrieved for application ${applicationId}`);
        return {
          file: fileData.buffer,
          fileName: application.resumeFile,
          mimeType,
        };
      } catch (fileError) {
        this.logger.error('Failed to retrieve resume file', {
          applicationId,
          professorId,
          fileName: application.resumeFile,
          error: fileError.message,
        });
        throw new NotFoundException('Resume file not found');
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.logger.error('Failed to retrieve resume', {
        applicationId,
        professorId,
        error: error.message,
        stack: error.stack,
      });
      throw new InternalServerErrorException('Failed to retrieve resume');
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
}
