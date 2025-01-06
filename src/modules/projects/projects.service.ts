import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { ErrorHandler } from '@/common/utils/error-handler.util';
import {
  CreateProjectDto,
  ProjectFileDto,
  ProjectResponseDto,
  UpdateProjectDto,
} from '@common/dto/projects';
import { Professor } from '@modules/professors/schemas/professors.schema';

import { Project, ProjectStatus } from './schemas/projects.schema';
import { FileStorageService } from '../file-storage/file-storage.service';

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);

  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
    private readonly fileStorageService: FileStorageService,
  ) {}

  private transformToProjectResponse(project: Project): ProjectResponseDto {
    try {
      if (!project) {
        throw new Error('Project data is undefined');
      }

      this.logger.debug('Transforming project data:', {
        projectId: project._id,
        professorData: project.professor,
      });

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

      this.logger.debug('Finding projects with filter:', { filter, sortOptions });

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

      this.logger.debug(`Found ${projects.length} projects out of ${total} total`);

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
}
