import { applyDecorators, HttpStatus } from '@nestjs/common';
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
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import { ApplicationResponseDto, UpdateApplicationStatusDto } from '@/common/dto/applications';
import { ApplicationStatus } from '@/common/enums';

import {
  ApplicationDescriptions,
  applicationSwaggerFileSchema as applicationFileSchema,
  applicationResumeResponseContent as resumeResponseContent,
} from '../descriptions/applications.description';

export const ApiCreateApplication = () =>
  applyDecorators(
    ApiOperation(ApplicationDescriptions.create),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: applicationFileSchema,
    }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Application submitted successfully',
      type: ApplicationResponseDto,
    }),
    ApiBadRequestResponse({
      description:
        'Invalid request (Invalid data format, project not accepting applications, or deadline passed)',
    }),
    ApiUnprocessableEntityResponse({
      description: 'Invalid resume file (Wrong type or size)',
    }),
    ApiNotFoundResponse({ description: 'Project not found' }),
  );

export const ApiFindAllApplications = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation(ApplicationDescriptions.findAll),
    ApiParam(ApplicationDescriptions.params.projectId),
    ApiQuery({
      name: 'status',
      enum: ApplicationStatus,
      required: false,
      description: 'Filter applications by status',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Applications retrieved successfully',
      type: [ApplicationResponseDto],
    }),
    ApiUnauthorizedResponse({ description: 'Not authenticated' }),
    ApiNotFoundResponse({ description: 'Project not found' }),
  );

export const ApiUpdateApplicationStatus = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation(ApplicationDescriptions.updateStatus),
    ApiParam(ApplicationDescriptions.params.projectId),
    ApiParam(ApplicationDescriptions.params.applicationId),
    ApiBody({
      type: UpdateApplicationStatusDto,
      examples: {
        accept: {
          summary: 'Accept Application',
          description: 'Accept a pending application',
          value: {
            status: ApplicationStatus.ACCEPTED,
          },
        },
        reject: {
          summary: 'Reject Application',
          description: 'Reject a pending application',
          value: {
            status: ApplicationStatus.REJECTED,
          },
        },
        withdraw: {
          summary: 'Mark as Withdrawn',
          description: 'Mark application as withdrawn by student',
          value: {
            status: ApplicationStatus.WITHDRAWN,
          },
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: ApplicationDescriptions.responses.statusUpdated,
      type: ApplicationResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: ApplicationDescriptions.responses.unauthorized,
    }),
    ApiNotFoundResponse({
      description: ApplicationDescriptions.responses.notFound,
    }),
    ApiBadRequestResponse({
      description: `Invalid request. Possible reasons:
          - ${ApplicationDescriptions.responses.invalidTransition}
          - ${ApplicationDescriptions.responses.alreadyProcessed}`,
    }),
    ApiResponse({
      status: HttpStatus.UNPROCESSABLE_ENTITY,
      description: 'Invalid status value provided',
    }),
  );

export const ApiDownloadResume = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation(ApplicationDescriptions.downloadResume),
    ApiParam(ApplicationDescriptions.params.projectId),
    ApiParam(ApplicationDescriptions.params.applicationId),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Resume file stream',
      content: resumeResponseContent,
    }),
    ApiUnauthorizedResponse({ description: 'Not authenticated' }),
    ApiNotFoundResponse({ description: 'Resume file not found' }),
  );
