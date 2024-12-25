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
  } from '@nestjs/common';
  import { 
    ApiTags, 
    ApiOperation, 
    ApiResponse, 
    ApiBearerAuth,
    ApiUnauthorizedResponse,
    ApiBadRequestResponse,
    ApiOkResponse,
    ApiQuery,
    getSchemaPath,
    ApiParam,
    ApiBody,
    ApiConsumes,
  } from '@nestjs/swagger';
  import { ProjectsService } from './projects.service';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { GetProfessor } from '../professors/decorators/get-professor.decorator';
  import { Professor } from '../professors/schemas/professors.schema';
  import { CreateProjectDto } from './dto/create-project.dto';
  import { UpdateProjectDto } from './dto/update-project.dto';
  import { ProjectResponseDto } from './dto/project-response.dto';
  import { ProjectStatus } from './schemas/projects.schema';
import { FileStorageService } from '../file-storage/file-storage.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProjectFileDto } from './dto/project-file.dto';
  
  @ApiTags('Projects')
  @Controller('projects')
  @ApiBearerAuth()
  export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService, 
        private readonly fileStorageService: FileStorageService,

    ) {}
  
    @Post()
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ 
      summary: 'Create a new research project',
      description: 'Creates a new research project. All dates must be in the future, and endDate must be after startDate.'
    })
    @ApiResponse({ 
      status: HttpStatus.CREATED, 
      description: 'Project successfully created',
      type: ProjectResponseDto 
    })
    @ApiUnauthorizedResponse({ 
      description: 'Unauthorized - Invalid or missing JWT token' 
    })
    @ApiBadRequestResponse({ 
      description: 'Invalid input - Validation failed',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 400 },
          message: { 
            type: 'array', 
            items: { type: 'string' },
            example: [
              'title must not be empty',
              'endDate must be after startDate',
              'applicationDeadline must be a future date'
            ]
          },
          error: { type: 'string', example: 'Bad Request' }
        }
      }
    })
    @ApiBody({
      type: CreateProjectDto,
      examples: {
        valid: {
          summary: 'Valid Project',
          value: {
            title: 'AI Research Assistant',
            description: 'Research project focusing on AI',
            department: 'Computer Science',
            requirements: ['Python', 'Machine Learning'],
            startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
            endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 180 days from now
            status: 'DRAFT',
            positions: 2,
            tags: ['AI', 'ML'],
            applicationDeadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 15 days from now
          }
        }
      }
    })
    async create(
        @GetProfessor() professor: Professor,
        @Body() createProjectDto: CreateProjectDto
      ): Promise<ProjectResponseDto> {
        console.log('Professor from decorator:', professor);
        console.log('Professor ID:', professor._id);
        return this.projectsService.create(professor, createProjectDto);
      }
        

      @Get()
      @ApiOperation({ 
        summary: 'List all visible research projects',
        description: 'Retrieves a paginated list of research projects with various filtering options'
      })
      @ApiQuery({ 
        name: 'search', 
        required: false, 
        type: String, 
        description: 'Search in title, description, and tags. Supports partial matches.',
        example: 'machine learning'
      })
      @ApiQuery({ 
        name: 'tags', 
        required: false, 
        type: [String], 
        description: 'Filter by multiple tags. Use comma for multiple values.',
        example: ['AI', 'Machine Learning']
      })
      @ApiQuery({ 
        name: 'department', 
        required: false, 
        type: String,
        example: 'Computer Science'
      })
      @ApiQuery({ 
        name: 'status', 
        required: false, 
        enum: ProjectStatus,
        example: ProjectStatus.PUBLISHED
      })
      @ApiResponse({
        status: 200,
        description: 'Successfully retrieved projects',
        schema: {
          properties: {
            projects: {
              type: 'array',
              items: { $ref: getSchemaPath(ProjectResponseDto) }
            },
            total: {
              type: 'number',
              example: 50
            }
          }
        }
      })
      async findAll(
        @Query('page') page?: number,
        @Query('limit') limit?: number,
        @Query('department') department?: string,
        @Query('status') status?: ProjectStatus,
        @Query('search') search?: string,
        @Query('tags') tags?: string[],
        @Query('researchAreas') researchAreas?: string[],
        @Query('sortBy') sortBy?: 'createdAt' | 'applicationDeadline' | 'startDate',
        @Query('sortOrder') sortOrder?: 'asc' | 'desc',
      ): Promise<{ projects: ProjectResponseDto[]; total: number }> {
        return this.projectsService.findAll({
          page,
          limit,
          department,
          status,
          search,
          tags: Array.isArray(tags) ? tags : tags ? [tags] : undefined,
          researchAreas: Array.isArray(researchAreas) ? researchAreas : researchAreas ? [researchAreas] : undefined,
          sortBy,
          sortOrder,
        });
      }

    @Get('my-projects')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Get professor\'s projects' })
    @ApiQuery({ 
    name: 'status', 
    required: false, 
    enum: ProjectStatus,
    description: 'Filter projects by status' 
    })
    @ApiOkResponse({ 
        description: 'List of professor\'s projects',
        type: [ProjectResponseDto] 
      })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    async findProfessorProjects(
      @GetProfessor() professor: Professor,
      @Query('status') status?: ProjectStatus,
    ): Promise<ProjectResponseDto[]> {
      return this.projectsService.findProfessorProjects(professor.id, status);
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Get project by ID' })
    @ApiResponse({ 
      status: 200,
      description: 'Project details',
      type: ProjectResponseDto 
    })
    @ApiResponse({ status: 404, description: 'Project not found' })
    async findOne(@Param('id') id: string): Promise<ProjectResponseDto> {
      return this.projectsService.findOne(id);
    }
  
    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Update project' })
    @ApiParam({ name: 'id', description: 'Project ID' })
    @ApiResponse({ 
      status: HttpStatus.OK,
      description: 'Project updated successfully',
      type: ProjectResponseDto 
    })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiBadRequestResponse({ 
      description: 'Invalid input or project dates validation failed' 
    })
    @ApiResponse({ 
      status: HttpStatus.NOT_FOUND, 
      description: 'Project not found or professor not authorized' 
    })
    async update(
      @GetProfessor() professor: Professor,
      @Param('id') id: string,
      @Body() updateProjectDto: UpdateProjectDto
    ): Promise<ProjectResponseDto> {
      return this.projectsService.update(professor.id, id, updateProjectDto);
    }
  
    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete project' })
    @ApiResponse({ status: 204, description: 'Project deleted successfully' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Project not found' })
    async remove(
      @GetProfessor() professor: Professor,
      @Param('id') id: string
    ): Promise<void> {
      await this.projectsService.remove(professor.id, id);
    }

    @Post(':id/files')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Upload project file' })
    @ApiParam({ name: 'id', description: 'Project ID' })
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    })
    @ApiResponse({
        status: 201,
        description: 'File uploaded successfully',
        type: ProjectFileDto,
      })
      @ApiResponse({ status: 400, description: 'Invalid file type or size' })
      @ApiResponse({ status: 404, description: 'Project not found' })
    async uploadFile(
      @Param('id') id: string,
      @GetProfessor() professor: Professor,
      @UploadedFile(
        new ParseFilePipe({
          validators: [
            new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
            new FileTypeValidator({ fileType: /(pdf|doc|docx)$/ }),
          ],
        }),
      )
      file: Express.Multer.File,
    ): Promise<ProjectFileDto> {
      return this.projectsService.addProjectFile(professor.id, id, file);
    }
  
    @Delete(':id/files/:fileName')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete project file' })
    @ApiParam({ name: 'id', description: 'Project ID' })
    @ApiParam({ name: 'fileName', description: 'File name to delete' })
    @ApiResponse({ status: 204, description: 'File deleted successfully' })
    @ApiResponse({ status: 404, description: 'File or project not found' })
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteFile(
      @Param('id') id: string,
      @Param('fileName') fileName: string,
      @GetProfessor() professor: Professor,
    ): Promise<void> {
      await this.projectsService.removeProjectFile(professor.id, id, fileName);
    }
  }