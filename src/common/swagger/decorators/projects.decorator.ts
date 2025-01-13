import { HttpStatus, applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
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
import { createProjectExamples, updateProjectExamples } from '../examples/project.examples';

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
      isArray: true,
      description: 'Filter by research categories (comma-separated)',
      example: ['Machine Learning', 'Computer Vision'],
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
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
            description: 'File to upload (PDF, DOC, or DOCX)',
          },
        },
      },
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

// ... existing imports ...

export const ApiCloseProject = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Close project',
      description: `
        Close a research project and notify all applicants.
        
        Closing Process:
        - Project status changes to CLOSED
        - Project becomes hidden
        - All pending applications are closed
        - Email notifications sent to all applicants
        - Project and applications remain in database
        
        Access Rules:
        - Only project owner can close their project
        - Cannot reopen a closed project
        - All pending applications are automatically closed
        
        Note: This action cannot be undone.
      `,
    }),
    ApiParam({
      name: 'id',
      description: 'Project ID',
      example: '507f1f77bcf86cd799439011',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Project closed successfully and notifications sent',
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
  );
