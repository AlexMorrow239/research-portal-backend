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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiQuery,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  getSchemaPath,
} from '@nestjs/swagger';

import { createProjectExamples, updateProjectExamples } from '@/common/swagger';
import { ProjectDescriptions } from '@/common/swagger/descriptions/projects.description';

import { ProjectsService } from './projects.service';
import { ProjectStatus } from './schemas/projects.schema';
import { CreateProjectDto } from '../../common/dto/projects/create-project.dto';
import { ProjectFileDto } from '../../common/dto/projects/project-file.dto';
import { ProjectResponseDto } from '../../common/dto/projects/project-response.dto';
import { UpdateProjectDto } from '../../common/dto/projects/update-project.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetProfessor } from '../professors/decorators/get-professor.decorator';
import { Professor } from '../professors/schemas/professors.schema';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  private readonly logger = new Logger(ProjectsController.name);

  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation(ProjectDescriptions.create)
  @ApiBody({
    type: CreateProjectDto,
    examples: createProjectExamples,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Project created successfully',
    type: ProjectResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiBadRequestResponse({ description: 'Invalid project data' })
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
  @ApiOperation({
    summary: 'List all research projects',
    description:
      'Retrieve a paginated list of all visible research projects. No authentication required.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (default: 10)',
  })
  @ApiQuery({
    name: 'department',
    required: false,
    type: String,
    description: 'Filter by professor department',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ProjectStatus,
    description: 'Filter by project status (default: PUBLISHED)',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search in title and description',
  })
  @ApiQuery({
    name: 'researchCategories',
    required: false,
    type: [String],
    description: 'Filter by research categories (comma-separated)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Projects retrieved successfully',
    schema: {
      properties: {
        projects: {
          type: 'array',
          items: { $ref: getSchemaPath(ProjectResponseDto) },
        },
        total: {
          type: 'number',
          example: 50,
        },
      },
    },
  })
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
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation(ProjectDescriptions.findProfessorProjects)
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ProjectStatus,
    description: 'Filter projects by status',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Projects retrieved successfully',
    type: [ProjectResponseDto],
  })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async findProfessorProjects(
    @GetProfessor() professor: Professor,
    @Query('status') status?: ProjectStatus,
  ): Promise<ProjectResponseDto[]> {
    return await this.projectsService.findProfessorProjects(professor.id, status);
  }

  @Get(':id')
  @ApiOperation(ProjectDescriptions.findOne)
  @ApiParam({
    name: 'id',
    description: 'Project ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Project retrieved successfully',
    type: ProjectResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Project not found' })
  async findOne(@Param('id') id: string): Promise<ProjectResponseDto> {
    return await this.projectsService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation(ProjectDescriptions.update)
  @ApiParam({
    name: 'id',
    description: 'Project ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiBody({
    type: UpdateProjectDto,
    examples: updateProjectExamples,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Project updated successfully',
    type: ProjectResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiNotFoundResponse({ description: 'Project not found' })
  @ApiBadRequestResponse({ description: 'Invalid update data' })
  async update(
    @GetProfessor() professor: Professor,
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<ProjectResponseDto> {
    return await this.projectsService.update(professor.id, id, updateProjectDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation(ProjectDescriptions.remove)
  @ApiParam({
    name: 'id',
    description: 'Project ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Project deleted successfully',
  })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiNotFoundResponse({ description: 'Project not found' })
  async remove(@GetProfessor() professor: Professor, @Param('id') id: string): Promise<void> {
    return await this.projectsService.remove(professor.id, id);
  }

  @Post(':id/files')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation(ProjectDescriptions.uploadFile)
  @ApiParam({
    name: 'id',
    description: 'Project ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'File to upload (PDF, DOC, DOCX only, max 5MB)',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'File uploaded successfully',
    type: ProjectFileDto,
  })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiNotFoundResponse({ description: 'Project not found' })
  @ApiBadRequestResponse({ description: 'Invalid file type or size' })
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
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation(ProjectDescriptions.deleteFile)
  @ApiParam({
    name: 'id',
    description: 'Project ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiParam({
    name: 'fileName',
    description: 'Name of file to delete',
    example: 'project_description.pdf',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'File deleted successfully',
  })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiNotFoundResponse({ description: 'Project or file not found' })
  async deleteFile(
    @Param('id') id: string,
    @Param('fileName') fileName: string,
    @GetProfessor() professor: Professor,
  ): Promise<void> {
    return await this.projectsService.removeProjectFile(professor.id, id, fileName);
  }
}
