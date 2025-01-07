import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiBody,
} from '@nestjs/swagger';

import { CreateTestTokenDto } from '@/common/dto/email/create-test-token.dto';
import { EmailTrackingResponseDto } from '@/common/dto/email/email-tracking-response.dto';
import { GlobalStatsDto } from '@/common/dto/email/global-stats.dto';

import { EmailDescriptions } from '../descriptions/email.description';

export const ApiTrackEmailClick = () =>
  applyDecorators(
    ApiOperation({
      summary: EmailDescriptions.trackClick.summary,
      description: EmailDescriptions.trackClick.description,
    }),
    ApiParam({
      name: 'token',
      description: 'Email tracking token',
      example: 'abc123-def456',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: EmailDescriptions.responses.tracked,
      type: EmailTrackingResponseDto,
    }),
    ApiNotFoundResponse({
      description: EmailDescriptions.responses.invalidToken,
    }),
  );

export const ApiCreateTestToken = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: EmailDescriptions.createTestToken.summary,
      description: EmailDescriptions.createTestToken.description,
    }),
    ApiBody({ type: CreateTestTokenDto }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: EmailDescriptions.responses.tokenCreated,
      type: EmailTrackingResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: EmailDescriptions.responses.unauthorized,
    }),
  );

export const ApiGetEmailStats = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: EmailDescriptions.getStats.summary,
      description: EmailDescriptions.getStats.description,
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: EmailDescriptions.responses.statsRetrieved,
      type: GlobalStatsDto,
    }),
    ApiUnauthorizedResponse({
      description: EmailDescriptions.responses.unauthorized,
    }),
  );
