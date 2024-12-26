import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Application, ApplicationStatus } from './schemas/applications.schema';
import { CreateApplicationDto } from './dto/create-application.dto';
import { ProjectsService } from '../projects/projects.service';
import { FileStorageService } from '../file-storage/file-storage.service';
import { ProjectStatus } from '../projects/schemas/projects.schema';
import { EmailService } from '../email/email.service';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectModel(Application.name) private applicationModel: Model<Application>,
    private readonly projectsService: ProjectsService,
    private readonly fileStorageService: FileStorageService,
    private readonly emailService: EmailService
  ) {}

  async create(
    projectId: string,
    createApplicationDto: CreateApplicationDto,
    resumeFile: Express.Multer.File,
  ): Promise<Application> {
    try {
      console.log('Creating application with data:', {
        projectId,
        dto: createApplicationDto,
        file: {
          originalname: resumeFile.originalname,
          mimetype: resumeFile.mimetype,
          size: resumeFile.size,
        },
      });
  
      const project = await this.projectsService.findOne(projectId);

      if (project.status !== ProjectStatus.PUBLISHED) {
        throw new BadRequestException('Project is not accepting applications');
      }
  
      if (new Date() > new Date(project.applicationDeadline)) {
        throw new BadRequestException('Application deadline has passed');
      }
  
      const fileName = await this.fileStorageService.saveFile(
        resumeFile,
        `resumes`,
      );
  
      const application = await this.applicationModel.create({
        project: projectId,
        studentInfo: createApplicationDto.studentInfo,
        statement: createApplicationDto.statement,
        resumeFile: fileName,
        status: ApplicationStatus.PENDING,
      });
  
      return application;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error; // Propagate NotFoundException from ProjectsService
      }
      console.error('Error creating application:', error);
      throw error;
    }
  }
  
  async updateStatus(
    professorId: string,
    applicationId: string,
    status: ApplicationStatus,
    notes?: string,
  ): Promise<Application> {
    console.log('Updating application status:', {
      professorId,
      applicationId,
      status,
      notes
    });
  
    const application = await this.applicationModel
      .findById(applicationId)
      .populate({
        path: 'project',
        populate: {
          path: 'professor',
          select: 'id email name'
        }
      });
  
    console.log('Found application:', {
      exists: !!application,
      applicationData: application ? {
        id: application.id,
        projectId: application.project?.id,
        professorId: application.project?.professor?.id
      } : null
    });
  
    if (!application) {
      throw new NotFoundException('Application not found');
    }
  
    // Check if project and professor are properly populated
    if (!application.project || !application.project.professor) {
      console.error('Project or professor not properly populated:', {
        hasProject: !!application.project,
        hasProfessor: !!application.project?.professor
      });
      throw new NotFoundException('Application project details not found');
    }
  
    const projectProfessorId = application.project.professor.id?.toString();
    console.log('Comparing professor IDs:', {
      tokenProfessorId: professorId,
      projectProfessorId,
      match: projectProfessorId === professorId
    });
  
    if (projectProfessorId !== professorId) {
      throw new NotFoundException('Application not found');
    }
  
    const updatedApplication = await this.applicationModel.findByIdAndUpdate(
      applicationId,
      { status, professorNotes: notes },
      { new: true }
    );
  
    // Send email notification
    try {
      await this.emailService.sendApplicationStatusUpdate(
        application.studentInfo.email,
        application.project.title,
        status,
        `${application.project.professor.name.firstName} ${application.project.professor.name.lastName}`,
        notes
      );
    } catch (error) {
      console.error('Failed to send email notification:', error);
      // Continue with the update even if email fails
    }
  
    return updatedApplication;
  }

  async findProjectApplications(
    professorId: string,
    projectId: string,
    status?: ApplicationStatus,
  ): Promise<Application[]> {
    console.log('Finding applications with:', { professorId, projectId, status });
    
    const project = await this.projectsService.findOne(projectId);
    console.log('Found project:', {
      projectId: project.id,
      professorId: project.professor.id,
      professorIdString: project.professor.id.toString()
    });
    
    if (project.professor.id.toString() !== professorId.toString()) {
      console.log('Professor ID mismatch:', {
        tokenProfessorId: professorId,
        projectProfessorId: project.professor.id
      });
      throw new NotFoundException('Project not found');
    }
  
    const filter: any = { project: projectId };
    if (status) {
      filter.status = status;
    }
  
    return this.applicationModel
      .find(filter)
      .sort({ createdAt: -1 });
  }

  async getResume(professorId: string, applicationId: string): Promise<{
    file: Buffer;
    fileName: string;
    mimeType: string;
  }> {
    const application = await this.applicationModel
      .findById(applicationId)
      .populate({
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
      
      return {
        file: fileData.buffer,
        fileName: application.resumeFile,
        mimeType: 'application/pdf', // Assuming PDF format for resumes
      };
    } catch (error) {
      throw new NotFoundException('Resume file not found');
    }
  }
}