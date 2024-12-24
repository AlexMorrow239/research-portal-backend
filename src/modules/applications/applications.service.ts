import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Application, ApplicationStatus } from './schemas/applications.schema';
import { CreateApplicationDto } from './dto/create-application.dto';
import { ProjectsService } from '../projects/projects.service';
import { FileStorageService } from '../file-storage/file-storage.service';
import { ProjectStatus } from '../projects/schemas/projects.schema';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectModel(Application.name) private applicationModel: Model<Application>,
    private readonly projectsService: ProjectsService,
    private readonly fileStorageService: FileStorageService,
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
        `applications/${projectId}`,
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
    const application = await this.applicationModel
      .findById(applicationId)
      .populate('project');

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (application.project.professor.toString() !== professorId) {
      throw new NotFoundException('Application not found');
    }

    return this.applicationModel.findByIdAndUpdate(
      applicationId,
      { status, professorNotes: notes },
      { new: true }
    );
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