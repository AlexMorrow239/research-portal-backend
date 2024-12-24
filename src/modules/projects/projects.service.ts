import { FileStorageService } from './../file-storage/file-storage.service';
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectStatus } from './schemas/projects.schema';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Professor } from '../professors/schemas/professors.schema';
import { ProjectResponseDto } from './dto/project-response.dto';
import { ProjectFileDto } from './dto/project-file.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
    private readonly fileStorageService: FileStorageService,
  ) {}

    async create(professor: Professor, createProjectDto: CreateProjectDto): Promise<ProjectResponseDto> {
        console.log('Creating project with professor:', professor);
        console.log('Project DTO:', createProjectDto);
        
        try {
        const project = await this.projectModel.create({
            ...createProjectDto,
            professor: professor.id, 
            status: ProjectStatus.DRAFT,
            isVisible: false,
        });
    
        console.log('Created project:', project);
    
        return {
            id: project._id.toString(),
            ...project.toObject(),
            professor: {
            id: professor.id,
            name: professor.name,
            department: professor.department
            }
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
    }): Promise<{ projects: ProjectResponseDto[]; total: number }> {
    const { 
        page = 1, 
        limit = 10, 
        department, 
        status,
        search,
        tags 
    } = query;

    const filter: any = {};

    if (department) {
        filter.department = department;
    }

    if (status) {
        filter.status = status;
    }

    if (search) {
        filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
        ];
    }

    if (tags && tags.length > 0) {
        filter.tags = { $all: tags };
    }

    const [projects, total] = await Promise.all([
        this.projectModel
        .find(filter)
        .populate('professor', 'name department email')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
        this.projectModel.countDocuments(filter)
    ]);

    return {
        projects: projects.map(project => ({
        id: project._id.toString(),
        ...project.toObject(),
        professor: {
            id: project.professor._id,
            name: project.professor.name,
            department: project.professor.department
        }
        })),
        total
    };
    }
    async findOne(id: string): Promise<ProjectResponseDto> {
        const project = await this.projectModel
        .findById(id)
        .populate('professor', 'name department')
        .exec();
    
        if (!project) {
        throw new NotFoundException('Project not found');
        }
    
        return {
        id: project._id.toString(),
        ...project.toObject(),
        professor: {
            id: project.professor._id,
            name: project.professor.name,
            department: project.professor.department
        }
        };
    }

    async update(
        professorId: string,
        projectId: string,
        updateProjectDto: UpdateProjectDto
    ): Promise<ProjectResponseDto> {
        const updatedProject = await this.projectModel
        .findOneAndUpdate(
            { _id: projectId, professor: professorId },
            updateProjectDto,
            { new: true }
        )
        .populate('professor', 'name department');
    
        if (!updatedProject) {
        throw new NotFoundException('Project not found or you don\'t have permission to update it');
        }
    
        return {
        id: updatedProject._id.toString(),
        ...updatedProject.toObject(),
        professor: {
            id: updatedProject.professor._id,
            name: updatedProject.professor.name,
            department: updatedProject.professor.department
        }
        };
    }

    async remove(professorId: string, projectId: string): Promise<void> {
        const project = await this.projectModel.findOneAndDelete({
        _id: projectId,
        professor: professorId
        });

        if (!project) {
        throw new NotFoundException('Project not found or you don\'t have permission to delete it');
        }
    }

    async findProfessorProjects(
        professorId: string,
        status?: ProjectStatus
    ): Promise<ProjectResponseDto[]> {
        const projects = await this.projectModel
        .find({ professor: professorId, ...(status && { status }) })
        .populate('professor', 'name department')
        .sort({ createdAt: -1 })
        .exec();
    
        return projects.map(project => ({
        id: project._id.toString(),
        ...project.toObject(),
        professor: {
            id: project.professor._id,
            name: project.professor.name,
            department: project.professor.department
        }
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
        throw new NotFoundException('Project not found or you don\'t have permission to modify it');
        }

        const fileName = await this.fileStorageService.saveFile(file, projectId);

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

    async removeProjectFile(
        professorId: string,
        projectId: string,
        fileName: string,
    ): Promise<void> {
        const project = await this.projectModel.findOne({
        _id: projectId,
        professor: professorId,
        'files.fileName': fileName,
        });

        if (!project) {
        throw new NotFoundException('Project or file not found');
        }

        await this.fileStorageService.deleteFile(fileName);

        await this.projectModel.findByIdAndUpdate(projectId, {
        $pull: { files: { fileName } },
        });
    }
}