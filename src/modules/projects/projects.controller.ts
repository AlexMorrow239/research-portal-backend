import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  UploadedFile,
  UseInterceptors,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

import {
  CreateProjectDto,
  ProjectFileDto,
  ProjectResponseDto,
  UpdateProjectDto,
} from '@/common/dto/projects';
import {
  ApiCreateProject,
  ApiFindAllProjects,
  ApiFindProfessorProjects,
  ApiFindOneProject,
  ApiUpdateProject,
  ApiRemoveProject,
  ApiUploadProjectFile,
  ApiDeleteProjectFile,
} from '@/common/swagger/decorators/projects.decorator';

import { ProjectsService } from './projects.service';
import { ProjectStatus } from './schemas/projects.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetProfessor } from '../professors/decorators/get-professor.decorator';
import { Professor } from '../professors/schemas/professors.schema';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  private readonly logger = new Logger(ProjectsController.name);

  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiCreateProject()
  async create(
    @GetProfessor() professor: Professor,
    @Body() createProjectDto: CreateProjectDto,
  ): Promise<ProjectResponseDto> {
    this.logger.debug('Creating project for professor:', {
      professorId: professor._id,
      professorEmail: professor.email,
    });

    if (!professor._id) {
      this.logger.error('Professor ID is missing');
      throw new UnauthorizedException('Invalid professor data');
    }

    return await this.projectsService.create(professor, createProjectDto);
  }

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

  @Get('my-projects')
  @UseGuards(JwtAuthGuard)
  @ApiFindProfessorProjects()
  async findProfessorProjects(
    @GetProfessor() professor: Professor,
    @Query('status') status?: ProjectStatus,
  ): Promise<ProjectResponseDto[]> {
    return await this.projectsService.findProfessorProjects(professor.id, status);
  }

  @Get(':id')
  @ApiFindOneProject()
  async findOne(@Param('id') id: string): Promise<ProjectResponseDto> {
    return await this.projectsService.findOne(id);
  }

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

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiRemoveProject()
  async remove(@GetProfessor() professor: Professor, @Param('id') id: string): Promise<void> {
    return await this.projectsService.remove(professor.id, id);
  }

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
}
