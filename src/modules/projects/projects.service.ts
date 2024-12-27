import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { FileStorageService } from './../file-storage/file-storage.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectFileDto } from './dto/project-file.dto';
import { ProjectResponseDto } from './dto/project-response.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project, ProjectStatus } from './schemas/projects.schema';
import { Professor } from '../professors/schemas/professors.schema';

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

    // Validate dates if they are provided
    if (createProjectDto.startDate) {
      if (createProjectDto.startDate <= now) {
        throw new BadRequestException('Start date must be in the future');
      }

      if (createProjectDto.endDate && createProjectDto.endDate <= createProjectDto.startDate) {
        throw new BadRequestException('End date must be after start date');
      }
    }

    if (createProjectDto.applicationDeadline) {
      if (createProjectDto.applicationDeadline <= now) {
        throw new BadRequestException('Application deadline must be in the future');
      }

      if (
        createProjectDto.startDate &&
        createProjectDto.applicationDeadline >= createProjectDto.startDate
      ) {
        throw new BadRequestException('Application deadline must be before start date');
      }
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
          name: professor.name,
          department: professor.department,
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
    tags?: string[];
    researchAreas?: string[];
    sortBy?: 'createdAt' | 'applicationDeadline' | 'startDate';
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ projects: ProjectResponseDto[]; total: number }> {
    const {
      page = 1,
      limit = 10,
      department,
      status,
      search,
      tags,
      researchAreas,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const filter: any = {};

    // Base filters
    if (department) {
      filter.department = department;
    }

    if (status) {
      filter.status = status;
    }

    // Enhanced search with text index
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    // Enhanced tag filtering with partial matches
    if (tags && tags.length > 0) {
      filter.tags = {
        $in: tags.map((tag) => new RegExp(tag, 'i')),
      };
    }

    // Research areas filtering
    if (researchAreas && researchAreas.length > 0) {
      filter.$or = [...(filter.$or || []), { 'professor.researchAreas': { $in: researchAreas } }];
    }

    // Visibility filter (always show only visible projects)
    filter.isVisible = true;

    // Dynamic sorting
    const sortOptions: any = {
      [sortBy]: sortOrder === 'desc' ? -1 : 1,
    };

    const [projects, total] = await Promise.all([
      this.projectModel
        .find(filter)
        .populate('professor', 'name department email researchAreas')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort(sortOptions)
        .exec(),
      this.projectModel.countDocuments(filter),
    ]);

    return {
      projects: projects.map((project) => ({
        id: project._id.toString(),
        ...project.toObject(),
        professor: {
          id: project.professor._id,
          name: project.professor.name,
          department: project.professor.department,
          researchAreas: project.professor.researchAreas,
        },
      })),
      total,
    };
  }

  async findOne(id: string): Promise<ProjectResponseDto> {
    const project = await this.projectModel
      .findById(id)
      .populate('professor', 'name department id') // Added 'id' to populated fields
      .exec();

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return {
      id: project._id.toString(),
      ...project.toObject(),
      professor: {
        id: project.professor._id, // Ensure professor ID is included
        name: project.professor.name,
        department: project.professor.department,
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
      .populate('professor', 'name department');

    if (!updatedProject) {
      throw new NotFoundException("Project not found or you don't have permission to update it");
    }

    return {
      id: updatedProject._id.toString(),
      ...updatedProject.toObject(),
      professor: {
        id: updatedProject.professor._id,
        name: updatedProject.professor.name,
        department: updatedProject.professor.department,
      },
    };
  }

  async remove(professorId: string, projectId: string): Promise<void> {
    const project = await this.projectModel.findOneAndDelete({
      _id: projectId,
      professor: professorId,
    });

    if (!project) {
      throw new NotFoundException("Project not found or you don't have permission to delete it");
    }
  }

  async findProfessorProjects(
    professorId: string,
    status?: ProjectStatus,
  ): Promise<ProjectResponseDto[]> {
    const projects = await this.projectModel
      .find({ professor: professorId, ...(status && { status }) })
      .populate('professor', 'name department')
      .sort({ createdAt: -1 })
      .exec();

    return projects.map((project) => ({
      id: project._id.toString(),
      ...project.toObject(),
      professor: {
        id: project.professor._id,
        name: project.professor.name,
        department: project.professor.department,
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
