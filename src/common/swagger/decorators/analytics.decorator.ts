import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

import { ComprehensiveAnalyticsDto } from '@/common/dto/analytics/comprehensive-analytics.dto';

import { AnalyticsDescriptions } from '../descriptions/analytics.description';

export const ApiGetProjectAnalytics = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation(AnalyticsDescriptions.getProjectAnalytics),
    ApiParam({
      name: 'projectId',
      description: 'Project identifier',
      example: '507f1f77bcf86cd799439011',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: AnalyticsDescriptions.responses.retrieved,
      type: ComprehensiveAnalyticsDto,
    }),
    ApiUnauthorizedResponse({
      description: AnalyticsDescriptions.responses.unauthorized,
    }),
    ApiNotFoundResponse({
      description: AnalyticsDescriptions.responses.notFound,
    }),
  );

export const ApiGetGlobalAnalytics = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation(AnalyticsDescriptions.getGlobalAnalytics),
    ApiResponse({
      status: HttpStatus.OK,
      description: AnalyticsDescriptions.responses.retrieved,
      type: ComprehensiveAnalyticsDto,
    }),
    ApiUnauthorizedResponse({
      description: AnalyticsDescriptions.responses.unauthorized,
    }),
  );
