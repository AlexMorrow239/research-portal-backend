import { forwardRef, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import mongoose, { Model } from 'mongoose';

import {
  CreateProjectDto,
  ProjectFileDto,
  ProjectResponseDto,
  UpdateProjectDto,
} from '@common/dto/projects';

import { ApplicationStatus } from '@/common/enums';
import { ErrorHandler } from '@/common/utils/error-handler.util';
import { ApplicationsService } from '@/modules/applications/applications.service';
import { EmailService } from '@/modules/email/email.service';

import { Professor } from '@modules/professors/schemas/professors.schema';

import { FileStorageService } from '../file-storage/file-storage.service';

import { Project, ProjectStatus } from './schemas/projects.schema';

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);

  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
    private readonly fileStorageService: FileStorageService,
    @Inject(forwardRef(() => ApplicationsService))
    private readonly applicationsService: ApplicationsService,
    private readonly emailService: EmailService,
  ) {}

  private transformToProjectResponse(project: Project): ProjectResponseDto {
    try {
      if (!project) {
        throw new Error('Project data is undefined');
      }

      return {
        id: project._id.toString(),
        title: project.title,
        description: project.description,
        professor: {
          id: project.professor._id.toString(),
          name: {
            firstName: project.professor.name.firstName,
            lastName: project.professor.name.lastName,
          },
          email: project.professor.email,
          department: project.professor.department,
        },
        researchCategories: project.researchCategories,
        requirements: project.requirements,
        files: project.files,
        status: project.status,
        positions: project.positions,
        applicationDeadline: project.applicationDeadline,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        isVisible: project.isVisible ?? true,
      };
    } catch (error) {
      ErrorHandler.handleServiceError(this.logger, error, 'transform project response', {
        projectId: project?._id,
      });
    }
  }

  async create(
    professor: Professor,
    createProjectDto: CreateProjectDto,
  ): Promise<ProjectResponseDto> {
    try {
      this.logger.log(`Creating project for professor ${professor._id}`);

      const project = await this.projectModel.create({
        ...createProjectDto,
        professor: professor._id,
      });

      const populatedProject = await project.populate('professor', 'name email department');

      this.logger.log(`Project created successfully by professor ${professor._id}`);

      return this.transformToProjectResponse(populatedProject);
    } catch (error) {
      ErrorHandler.handleServiceError(this.logger, error, 'create project', {
        professorId: professor._id,
      });
    }
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    department?: string;
    status?: ProjectStatus;
    search?: string;
    researchCategories?: string[];
    sortBy?: 'createdAt' | 'applicationDeadline';
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ projects: ProjectResponseDto[]; total: number }> {
    try {
      const {
        page = 1,
        limit = 10,
        department,
        status,
        search,
        researchCategories,
        sortBy = 'createdAt',
        sortOrder = 'desc',
      } = query;

      const filter: any = {};

      if (status) {
        filter.status = status;
      }

      if (department) {
        const professors = await this.projectModel.db
          .collection('professors')
          .find({ department })
          .project({ _id: 1 })
          .toArray();
        filter.professor = { $in: professors.map((prof) => prof._id) };
      }

      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }

      if (researchCategories?.length > 0) {
        filter.researchCategories = { $in: researchCategories };
      }

      const sortOptions: { [key: string]: mongoose.SortOrder } = {
        [sortBy]: sortOrder === 'desc' ? -1 : 1,
      };

      const [projects, total] = await Promise.all([
        this.projectModel
          .find(filter)
          .populate('professor', 'name department email')
          .skip((page - 1) * limit)
          .limit(limit)
          .sort(sortOptions)
          .exec(),
        this.projectModel.countDocuments(filter),
      ]);

      return {
        projects: projects.map((project) => this.transformToProjectResponse(project)),
        total,
      };
    } catch (error) {
      ErrorHandler.handleServiceError(this.logger, error, 'fetch projects', { query });
    }
  }

  async findOne(id: string): Promise<ProjectResponseDto> {
    try {
      const project = await this.projectModel
        .findById(id)
        .populate('professor', 'name department email')
        .exec();

      if (!project) {
        throw new NotFoundException('Project not found');
      }

      return this.transformToProjectResponse(project);
    } catch (error) {
      ErrorHandler.handleServiceError(this.logger, error, 'fetch project', { projectId: id }, [
        NotFoundException,
      ]);
    }
  }

  async update(
    professorId: string,
    projectId: string,
    updateProjectDto: UpdateProjectDto,
  ): Promise<ProjectResponseDto> {
    try {
      const updatedProject = await this.projectModel
        .findOneAndUpdate({ _id: projectId, professor: professorId }, updateProjectDto, {
          new: true,
        })
        .populate('professor', 'name department email');

      if (!updatedProject) {
        throw new NotFoundException("Project not found or you don't have permission to update it");
      }

      this.logger.log(`Project ${projectId} updated by professor ${professorId}`);
      return this.transformToProjectResponse(updatedProject);
    } catch (error) {
      ErrorHandler.handleServiceError(
        this.logger,
        error,
        'update project',
        { projectId, professorId },
        [NotFoundException],
      );
    }
  }

  async remove(professorId: string, projectId: string): Promise<void> {
    try {
      const project = await this.projectModel
        .findOneAndDelete({
          _id: projectId,
          professor: professorId,
        })
        .lean();

      if (!project) {
        throw new NotFoundException("Project not found or you don't have permission to delete it");
      }

      if (project?.files?.length > 0) {
        await Promise.all(
          project.files.map((file) => this.fileStorageService.deleteFile(file.fileName, true)),
        );
      }

      this.logger.log(`Project ${projectId} deleted by professor ${professorId}`);
    } catch (error) {
      ErrorHandler.handleServiceError(
        this.logger,
        error,
        'delete project',
        { projectId, professorId },
        [NotFoundException],
      );
    }
  }

  async findProfessorProjects(
    professorId: string,
    status?: ProjectStatus,
  ): Promise<ProjectResponseDto[]> {
    try {
      const projects = await this.projectModel
        .find({ professor: professorId, ...(status && { status }) })
        .populate('professor', 'name department email')
        .sort({ createdAt: -1 })
        .exec();

      return projects.map((project) => this.transformToProjectResponse(project));
    } catch (error) {
      ErrorHandler.handleServiceError(this.logger, error, 'fetch professor projects', {
        professorId,
        status,
      });
    }
  }

  async addProjectFile(
    professorId: string,
    projectId: string,
    file: Express.Multer.File,
  ): Promise<ProjectFileDto> {
    try {
      const project = await this.projectModel.findOne({
        _id: projectId,
        professor: professorId,
      });

      if (!project) {
        throw new NotFoundException("Project not found or you don't have permission to modify it");
      }

      const fileName = await this.fileStorageService.saveFile(file, projectId, true);

      const projectFile = {
        fileName,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        uploadedAt: new Date(),
      };

      await this.projectModel.findByIdAndUpdate(projectId, {
        $push: { files: projectFile },
      });

      this.logger.log(`File added to project ${projectId} by professor ${professorId}`);
      return projectFile;
    } catch (error) {
      ErrorHandler.handleServiceError(
        this.logger,
        error,
        'add project file',
        { projectId, professorId, fileName: file.originalname },
        [NotFoundException],
      );
    }
  }

  async removeProjectFile(professorId: string, projectId: string, fileName: string): Promise<void> {
    try {
      const project = await this.projectModel.findOne({
        _id: projectId,
        professor: professorId,
        'files.fileName': fileName,
      });

      if (!project) {
        throw new NotFoundException('Project or file not found');
      }

      await this.fileStorageService.deleteFile(fileName, true);

      await this.projectModel.findByIdAndUpdate(projectId, {
        $pull: { files: { fileName } },
      });

      this.logger.log(
        `File ${fileName} removed from project ${projectId} by professor ${professorId}`,
      );
    } catch (error) {
      ErrorHandler.handleServiceError(
        this.logger,
        error,
        'remove project file',
        { projectId, professorId, fileName },
        [NotFoundException],
      );
    }
  }

  async closeProject(professorId: string, projectId: string): Promise<void> {
    try {
      const project = await this.projectModel.findOne({
        _id: projectId,
        professor: professorId,
      });

      if (!project) {
        throw new NotFoundException("Project not found or you don't have permission to modify it");
      }

      // Update project status to closed and hide it
      await this.projectModel.findByIdAndUpdate(projectId, {
        status: ProjectStatus.CLOSED,
        isVisible: false,
      });

      // Get all pending applications for this project
      const applications = await this.applicationsService.findProjectApplications(
        professorId,
        projectId,
        ApplicationStatus.PENDING,
      );

      // Send emails to all applicants
      const emailPromises = applications.map((application) =>
        this.emailService.sendProjectClosedNotification(
          application.studentInfo.email,
          project.title,
        ),
      );

      await Promise.all([
        // Update all pending applications to closed
        this.applicationsService.closeProjectApplications(projectId),
        // Send all notification emails in parallel
        ...emailPromises,
      ]);

      this.logger.log(`Project ${projectId} closed by professor ${professorId}`);
    } catch (error) {
      ErrorHandler.handleServiceError(
        this.logger,
        error,
        'close project',
        { projectId, professorId },
        [NotFoundException],
      );
    }
  }
}
