import { HttpStatus, applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiTooManyRequestsResponse,
  getSchemaPath,
} from '@nestjs/swagger';

import {
  CreateProjectDto,
  ProjectFileDto,
  ProjectResponseDto,
  UpdateProjectDto,
} from '@/common/dto/projects';
import { ProjectStatus } from '@/modules/projects/schemas/projects.schema';

import { ProjectDescriptions } from '../descriptions/projects.description';
import {
  createProjectExamples,
  updateProjectExamples,
  projectFileExamples,
  findAllExamples,
  findProfessorProjectsExamples,
  deleteFileExamples,
} from '../examples/project.examples';

export const ApiCreateProject = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation(ProjectDescriptions.create),
    ApiBody({
      type: CreateProjectDto,
      examples: createProjectExamples,
    }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: ProjectDescriptions.responses.created,
      type: ProjectResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: ProjectDescriptions.responses.unauthorized,
    }),
    ApiBadRequestResponse({
      description: ProjectDescriptions.responses.invalidData,
    }),
    ApiForbiddenResponse({
      description: ProjectDescriptions.responses.ownershipRequired,
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: ProjectDescriptions.responses.serverError,
    }),
  );

export const ApiFindAllProjects = () =>
  applyDecorators(
    ApiOperation(ProjectDescriptions.findAll),
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: 'Page number (default: 1)',
      example: 1,
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: 'Items per page (default: 10)',
      example: 10,
    }),
    ApiQuery({
      name: 'department',
      required: false,
      type: String,
      description: 'Filter by professor department',
      example: 'Computer Science',
    }),
    ApiQuery({
      name: 'status',
      required: false,
      enum: ProjectStatus,
      description: 'Filter by project status (default: PUBLISHED)',
      example: ProjectStatus.PUBLISHED,
    }),
    ApiQuery({
      name: 'search',
      required: false,
      type: String,
      description: 'Search in title and description',
      example: 'machine learning',
    }),
    ApiQuery({
      name: 'researchCategories',
      required: false,
      type: [String],
      description: 'Filter by research categories (comma-separated)',
      example: ['Machine Learning', 'Computer Vision'],
    }),
    ApiBody({
      examples: findAllExamples,
      description: 'Search and filter criteria for projects',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: ProjectDescriptions.responses.retrieved,
      schema: {
        properties: {
          projects: {
            type: 'array',
            items: { $ref: getSchemaPath(ProjectResponseDto) },
          },
          total: {
            type: 'number',
            example: 50,
            description: 'Total number of projects matching the criteria',
          },
          page: {
            type: 'number',
            example: 1,
            description: 'Current page number',
          },
          limit: {
            type: 'number',
            example: 10,
            description: 'Number of items per page',
          },
        },
      },
    }),
    ApiBadRequestResponse({
      description: ProjectDescriptions.responses.invalidData,
    }),
  );

export const ApiFindProfessorProjects = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation(ProjectDescriptions.findProfessorProjects),
    ApiQuery({
      name: 'status',
      required: false,
      enum: ProjectStatus,
      description: 'Filter by project status',
    }),
    ApiBody({
      examples: findProfessorProjectsExamples,
      description: 'Filter criteria for professor projects',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: ProjectDescriptions.responses.retrieved,
      type: [ProjectResponseDto],
    }),
    ApiUnauthorizedResponse({
      description: ProjectDescriptions.responses.unauthorized,
    }),
  );

export const ApiDeleteProjectFile = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation(ProjectDescriptions.deleteFile),
    ApiParam({
      name: 'id',
      description: 'Project ID',
      example: '507f1f77bcf86cd799439011',
    }),
    ApiParam({
      name: 'fileName',
      description: 'Name of the file to delete',
      example: 'project-description.pdf',
    }),
    ApiBody({
      examples: deleteFileExamples,
      description: 'File deletion request',
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: ProjectDescriptions.responses.fileDeleted,
    }),
    ApiUnauthorizedResponse({
      description: ProjectDescriptions.responses.unauthorized,
    }),
    ApiForbiddenResponse({
      description: ProjectDescriptions.responses.ownershipRequired,
    }),
    ApiNotFoundResponse({
      description: ProjectDescriptions.responses.notFound,
    }),
    ApiBadRequestResponse({
      description: ProjectDescriptions.responses.invalidData,
    }),
  );

export const ApiFindOneProject = () =>
  applyDecorators(
    ApiOperation(ProjectDescriptions.findOne),
    ApiParam({
      name: 'id',
      description: 'Project ID',
      example: '507f1f77bcf86cd799439011',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: ProjectDescriptions.responses.retrieved,
      type: ProjectResponseDto,
    }),
    ApiNotFoundResponse({
      description: ProjectDescriptions.responses.notFound,
    }),
  );

export const ApiUpdateProject = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation(ProjectDescriptions.update),
    ApiParam({
      name: 'id',
      description: 'Project ID',
      example: '507f1f77bcf86cd799439011',
    }),
    ApiBody({
      type: UpdateProjectDto,
      examples: updateProjectExamples,
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: ProjectDescriptions.responses.updated,
      type: ProjectResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: ProjectDescriptions.responses.unauthorized,
    }),
    ApiForbiddenResponse({
      description: ProjectDescriptions.responses.ownershipRequired,
    }),
    ApiNotFoundResponse({
      description: ProjectDescriptions.responses.notFound,
    }),
    ApiBadRequestResponse({
      description: ProjectDescriptions.responses.invalidData,
    }),
    ApiResponse({
      status: HttpStatus.CONFLICT,
      description: ProjectDescriptions.responses.statusTransitionError,
    }),
  );

export const ApiUploadProjectFile = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiConsumes('multipart/form-data'),
    ApiOperation(ProjectDescriptions.uploadFile),
    ApiParam({
      name: 'id',
      description: 'Project ID',
      example: '507f1f77bcf86cd799439011',
    }),
    ApiBody({
      type: ProjectFileDto,
      examples: projectFileExamples,
    }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: ProjectDescriptions.responses.fileUploaded,
      type: ProjectFileDto,
    }),
    ApiUnauthorizedResponse({
      description: ProjectDescriptions.responses.unauthorized,
    }),
    ApiForbiddenResponse({
      description: ProjectDescriptions.responses.ownershipRequired,
    }),
    ApiNotFoundResponse({
      description: ProjectDescriptions.responses.notFound,
    }),
    ApiBadRequestResponse({
      description: ProjectDescriptions.responses.invalidFile,
    }),
    ApiTooManyRequestsResponse({
      description: ProjectDescriptions.responses.fileQuotaExceeded,
    }),
  );

export const ApiRemoveProject = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation(ProjectDescriptions.remove),
    ApiParam({
      name: 'id',
      description: 'Project ID',
      example: '507f1f77bcf86cd799439011',
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: ProjectDescriptions.responses.deleted,
    }),
    ApiUnauthorizedResponse({
      description: ProjectDescriptions.responses.unauthorized,
    }),
    ApiForbiddenResponse({
      description: ProjectDescriptions.responses.ownershipRequired,
    }),
    ApiNotFoundResponse({
      description: ProjectDescriptions.responses.notFound,
    }),
    ApiBadRequestResponse({
      description: ProjectDescriptions.responses.invalidData,
    }),
    ApiResponse({
      status: HttpStatus.CONFLICT,
      description: ProjectDescriptions.responses.archiveError,
    }),
  );
