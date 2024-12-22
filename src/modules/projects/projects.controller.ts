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
  } from '@nestjs/swagger';
  import { ProjectsService } from './projects.service';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { GetProfessor } from '../professors/decorators/get-professor.decorator';
  import { Professor } from '../professors/schemas/professors.schema';
  import { CreateProjectDto } from './dto/create-project.dto';
  import { UpdateProjectDto } from './dto/update-project.dto';
  import { ProjectResponseDto } from './dto/project-response.dto';
  import { ProjectStatus } from './schemas/projects.schema';
  
  @ApiTags('Projects')
  @Controller('projects')
  @ApiBearerAuth()
  export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) {}
  
    @Post()
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a new research project' })
    @ApiResponse({ 
      status: HttpStatus.CREATED, 
      description: 'Project successfully created',
      type: ProjectResponseDto 
    })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiBadRequestResponse({ 
      description: 'Invalid input or project dates validation failed' 
    })
    async create(
        @GetProfessor() professor: Professor,
        @Body() createProjectDto: CreateProjectDto
      ): Promise<ProjectResponseDto> {
        return this.projectsService.create(professor, createProjectDto);
      }

      @Get()
      @ApiOperation({ summary: 'List all visible research projects' })
      @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number, defaults to 1' })
      @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page, defaults to 10' })
      @ApiQuery({ name: 'department', required: false, type: String, description: 'Filter by department' })
      @ApiQuery({ name: 'status', required: false, enum: ProjectStatus, description: 'Filter by project status' })
      @ApiQuery({ name: 'search', required: false, type: String, description: 'Search in title and description' })
      @ApiQuery({ name: 'tags', required: false, type: [String], description: 'Filter by tags' })
      @ApiOkResponse({ 
        description: 'List of projects with pagination',
        schema: {
          properties: {
            projects: {
              type: 'array',
              items: { $ref: getSchemaPath(ProjectResponseDto) }
            },
            total: {
              type: 'number',
              description: 'Total number of projects matching the criteria'
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
      ): Promise<{ projects: ProjectResponseDto[]; total: number }> {
        return this.projectsService.findAll({
          page,
          limit,
          department,
          status,
          search,
          tags: Array.isArray(tags) ? tags : tags ? [tags] : undefined,
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
  }