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
      description: 'Project created successfully',
      type: ProjectResponseDto,
    }),
    ApiUnauthorizedResponse({ description: 'Not authenticated' }),
    ApiBadRequestResponse({ description: 'Invalid project data' }),
  );

export const ApiFindAllProjects = () =>
  applyDecorators(
    ApiOperation(ProjectDescriptions.findAll),
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: 'Page number (default: 1)',
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: 'Items per page (default: 10)',
    }),
    ApiQuery({
      name: 'department',
      required: false,
      type: String,
      description: 'Filter by professor department',
    }),
    ApiQuery({
      name: 'status',
      required: false,
      enum: ProjectStatus,
      description: 'Filter by project status (default: PUBLISHED)',
    }),
    ApiQuery({
      name: 'search',
      required: false,
      type: String,
      description: 'Search in title and description',
    }),
    ApiQuery({
      name: 'researchCategories',
      required: false,
      type: [String],
      description: 'Filter by research categories (comma-separated)',
    }),
    ApiResponse({
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
      description: 'Filter projects by status',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Projects retrieved successfully',
      type: [ProjectResponseDto],
    }),
    ApiUnauthorizedResponse({ description: 'Not authenticated' }),
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
      description: 'Project updated successfully',
      type: ProjectResponseDto,
    }),
    ApiUnauthorizedResponse({ description: 'Not authenticated' }),
    ApiNotFoundResponse({ description: 'Project not found' }),
    ApiBadRequestResponse({ description: 'Invalid update data' }),
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
    }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'File uploaded successfully',
      type: ProjectFileDto,
    }),
    ApiUnauthorizedResponse({ description: 'Not authenticated' }),
    ApiNotFoundResponse({ description: 'Project not found' }),
    ApiBadRequestResponse({ description: 'Invalid file type or size' }),
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
      description: 'Project retrieved successfully',
      type: ProjectResponseDto,
    }),
    ApiNotFoundResponse({ description: 'Project not found' }),
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
      description: 'Project deleted successfully',
    }),
    ApiUnauthorizedResponse({ description: 'Not authenticated' }),
    ApiNotFoundResponse({ description: 'Project not found' }),
    ApiBadRequestResponse({ description: 'Invalid project ID' }),
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
      description: 'File deleted successfully',
    }),
    ApiUnauthorizedResponse({ description: 'Not authenticated' }),
    ApiNotFoundResponse({ description: 'Project or file not found' }),
    ApiBadRequestResponse({ description: 'Invalid project ID or filename' }),
  );
