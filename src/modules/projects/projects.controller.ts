import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

import {
  ApiCloseProject,
  ApiCreateProject,
  ApiDeleteProjectFile,
  ApiFindAllProjects,
  ApiFindOneProject,
  ApiFindProfessorProjects,
  ApiRemoveProject,
  ApiUpdateProject,
  ApiUploadProjectFile,
} from '@/common/docs/decorators/projects.decorator';
import {
  CreateProjectDto,
  ProjectFileDto,
  ProjectResponseDto,
  UpdateProjectDto,
} from '@/common/dto/projects';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetProfessor } from '../professors/decorators/get-professor.decorator';
import { Professor } from '../professors/schemas/professors.schema';

import { ProjectsService } from './projects.service';
import { ProjectStatus } from './schemas/projects.schema';

// Handles research project operations
@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  private readonly logger = new Logger(ProjectsController.name);

  constructor(private readonly projectsService: ProjectsService) {}

  // Create new research project
  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiCreateProject()
  async create(
    @GetProfessor() professor: Professor,
    @Body() createProjectDto: CreateProjectDto,
  ): Promise<ProjectResponseDto> {
    if (!professor._id) {
      this.logger.error('Professor ID is missing');
      throw new UnauthorizedException('Invalid professor data');
    }

    return await this.projectsService.create(professor, createProjectDto);
  }

  // Get all projects with filters and pagination
  @Get()
  @ApiFindAllProjects()
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('department') department?: string,
    @Query('status') status: ProjectStatus = ProjectStatus.PUBLISHED,
    @Query('search') search?: string,
    @Query('researchCategories') researchCategories?: string[],
  ): Promise<{ projects: ProjectResponseDto[]; total: number }> {
    return await this.projectsService.findAll({
      page,
      limit,
      department,
      status,
      search,
      researchCategories: Array.isArray(researchCategories)
        ? researchCategories
        : researchCategories
          ? [researchCategories]
          : undefined,
    });
  }

  // Get professor's own projects
  @Get('my-projects')
  @UseGuards(JwtAuthGuard)
  @ApiFindProfessorProjects()
  async findProfessorProjects(
    @GetProfessor() professor: Professor,
    @Query('status') status?: ProjectStatus,
  ): Promise<ProjectResponseDto[]> {
    return await this.projectsService.findProfessorProjects(professor.id, status);
  }

  // Get single project by ID
  @Get(':id')
  @ApiFindOneProject()
  async findOne(@Param('id') id: string): Promise<ProjectResponseDto> {
    return await this.projectsService.findOne(id);
  }

  // Update project details
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiUpdateProject()
  async update(
    @GetProfessor() professor: Professor,
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<ProjectResponseDto> {
    return await this.projectsService.update(professor.id, id, updateProjectDto);
  }

  // Delete project
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiRemoveProject()
  async remove(@GetProfessor() professor: Professor, @Param('id') id: string): Promise<void> {
    return await this.projectsService.remove(professor.id, id);
  }

  // Upload project file
  @Post(':id/files')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiUploadProjectFile()
  async uploadFile(
    @Param('id') id: string,
    @GetProfessor() professor: Professor,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /(pdf|doc|docx)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<ProjectFileDto> {
    return await this.projectsService.addProjectFile(professor.id, id, file);
  }

  // Delete project file
  @Delete(':id/files/:fileName')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiDeleteProjectFile()
  async deleteFile(
    @Param('id') id: string,
    @Param('fileName') fileName: string,
    @GetProfessor() professor: Professor,
  ): Promise<void> {
    return await this.projectsService.removeProjectFile(professor.id, id, fileName);
  }

  // Close project and notify applicants
  @Patch(':id/close')
  @UseGuards(JwtAuthGuard)
  @ApiCloseProject()
  async closeProject(@Param('id') id: string, @GetProfessor() professor: Professor): Promise<void> {
    return await this.projectsService.closeProject(professor.id, id);
  }
}
