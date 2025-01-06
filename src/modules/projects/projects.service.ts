import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Professor } from '@modules/professors/schemas/professors.schema';
import { Project, ProjectStatus } from './schemas/projects.schema';
import {
  CreateProjectDto,
  ProjectFileDto,
  ProjectResponseDto,
  UpdateProjectDto,
} from '@common/dto/projects';
import { FileStorageService } from '../file-storage/file-storage.service';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
    private readonly fileStorageService: FileStorageService,
  ) {}

  async create(
    professor: Professor,
    createProjectDto: CreateProjectDto,
  ): Promise<ProjectResponseDto> {
    const now = new Date();

    if (createProjectDto.applicationDeadline && createProjectDto.applicationDeadline <= now) {
      throw new BadRequestException('Application deadline must be in the future');
    }

    try {
      const project = await this.projectModel.create({
        ...createProjectDto,
        professor: professor.id,
        isVisible: false,
      });

      return {
        id: project._id.toString(),
        ...project.toObject(),
        professor: {
          id: professor.id,
          name: `${professor.name.firstName} ${professor.name.lastName}`,
          department: professor.department,
          email: professor.email,
        },
      };
    } catch (error) {
      console.error('Project creation error:', error);
      throw error;
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

    // Base filters
    if (department) {
      filter['professor.department'] = department;
    }

    if (status) {
      filter.status = status;
    }

    // Enhanced search
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Research categories filtering
    if (researchCategories && researchCategories.length > 0) {
      filter.researchCategories = { $in: researchCategories };
    }

    // Visibility filter
    filter.isVisible = true;

    // Dynamic sorting
    const sortOptions: any = {
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
      projects: projects.map((project) => {
        const obj = project.toObject();
        return {
          id: project._id.toString(),
          ...obj,
          professor: {
            id: project.professor._id,
            name: `${project.professor.name.firstName} ${project.professor.name.lastName}`,
            department: project.professor.department,
            email: project.professor.email,
          },
        };
      }),
      total,
    };
  }

  async findOne(id: string): Promise<ProjectResponseDto> {
    const project = await this.projectModel
      .findById(id)
      .populate('professor', 'name department email')
      .exec();

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return {
      id: project._id.toString(),
      ...project.toObject(),
      professor: {
        id: project.professor._id,
        name: `${project.professor.name.firstName} ${project.professor.name.lastName}`,
        department: project.professor.department,
        email: project.professor.email,
      },
    };
  }

  async update(
    professorId: string,
    projectId: string,
    updateProjectDto: UpdateProjectDto,
  ): Promise<ProjectResponseDto> {
    const updatedProject = await this.projectModel
      .findOneAndUpdate({ _id: projectId, professor: professorId }, updateProjectDto, { new: true })
      .populate('professor', 'name department email');

    if (!updatedProject) {
      throw new NotFoundException("Project not found or you don't have permission to update it");
    }

    return {
      id: updatedProject._id.toString(),
      ...updatedProject.toObject(),
      professor: {
        id: updatedProject.professor._id,
        name: `${updatedProject.professor.name.firstName} ${updatedProject.professor.name.lastName}`,
        department: updatedProject.professor.department,
        email: updatedProject.professor.email,
      },
    };
  }

  async remove(professorId: string, projectId: string): Promise<void> {
    const project = await this.projectModel
      .findOneAndDelete({
        _id: projectId,
        professor: professorId,
      })
      .lean();

    if (!project) {
      throw new NotFoundException("Project not found or you don't have permission to delete it");
    }

    // Delete associated files
    if (project?.files?.length > 0) {
      await Promise.all(
        project.files.map((file) => this.fileStorageService.deleteFile(file.fileName, true)),
      );
    }
  }

  async findProfessorProjects(
    professorId: string,
    status?: ProjectStatus,
  ): Promise<ProjectResponseDto[]> {
    const projects = await this.projectModel
      .find({ professor: professorId, ...(status && { status }) })
      .populate('professor', 'name department email')
      .sort({ createdAt: -1 })
      .exec();

    return projects.map((project) => ({
      id: project._id.toString(),
      ...project.toObject(),
      professor: {
        id: project.professor._id,
        name: `${project.professor.name.firstName} ${project.professor.name.lastName}`,
        department: project.professor.department,
        email: project.professor.email,
      },
    }));
  }

  async addProjectFile(
    professorId: string,
    projectId: string,
    file: Express.Multer.File,
  ): Promise<ProjectFileDto> {
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

    return projectFile;
  }

  async removeProjectFile(professorId: string, projectId: string, fileName: string): Promise<void> {
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
  }
}
