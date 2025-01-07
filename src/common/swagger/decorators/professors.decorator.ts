import { HttpStatus, applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';

import {
  ChangePasswordDto,
  CreateProfessorDto,
  ProfessorResponseDto,
  ReactivateAccountDto,
  UpdateProfessorDto,
} from '@/common/dto/professors';

import { ProfessorDescriptions } from '../descriptions/professors.description';
import {
  createProfessorExamples,
  updateProfessorExamples,
  changePasswordExamples,
  reactivateExamples,
} from '../examples/professor.examples';

export const ApiCreateProfessor = () =>
  applyDecorators(
    ApiOperation(ProfessorDescriptions.create),
    ApiBody({
      type: CreateProfessorDto,
      examples: createProfessorExamples,
    }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: ProfessorDescriptions.responses.createSuccess,
      type: ProfessorResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: ProfessorDescriptions.responses.invalidAdminPassword,
    }),
    ApiConflictResponse({
      description: ProfessorDescriptions.responses.emailExists,
    }),
    ApiBadRequestResponse({
      description: ProfessorDescriptions.responses.invalidInput,
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: ProfessorDescriptions.responses.serverError,
    }),
  );

export const ApiGetProfile = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation(ProfessorDescriptions.getProfile),
    ApiResponse({
      status: HttpStatus.OK,
      description: ProfessorDescriptions.responses.profileRetrieved,
      type: ProfessorResponseDto,
    }),
    ApiUnauthorizedResponse({ description: ProfessorDescriptions.responses.notAuthenticated }),
  );

export const ApiUpdateProfile = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation(ProfessorDescriptions.updateProfile),
    ApiBody({
      type: UpdateProfessorDto,
      examples: updateProfessorExamples,
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: ProfessorDescriptions.responses.profileUpdated,
      type: ProfessorResponseDto,
    }),
    ApiUnauthorizedResponse({ description: ProfessorDescriptions.responses.notAuthenticated }),
    ApiBadRequestResponse({ description: ProfessorDescriptions.responses.invalidInput }),
  );

export const ApiChangePassword = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation(ProfessorDescriptions.changePassword),
    ApiBody({
      type: ChangePasswordDto,
      examples: changePasswordExamples,
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: ProfessorDescriptions.responses.passwordChanged,
    }),
    ApiUnauthorizedResponse({
      description: ProfessorDescriptions.responses.invalidCurrentPassword,
    }),
    ApiBadRequestResponse({ description: ProfessorDescriptions.responses.invalidPasswordFormat }),
  );

export const ApiDeactivateAccount = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation(ProfessorDescriptions.deactivateAccount),
    ApiResponse({
      status: HttpStatus.OK,
      description: ProfessorDescriptions.responses.accountDeactivated,
    }),
    ApiUnauthorizedResponse({ description: ProfessorDescriptions.responses.notAuthenticated }),
  );

export const ApiReactivateAccount = () =>
  applyDecorators(
    ApiOperation(ProfessorDescriptions.reactivateAccount),
    ApiBody({
      type: ReactivateAccountDto,
      examples: reactivateExamples,
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: ProfessorDescriptions.responses.accountReactivated,
    }),
    ApiUnauthorizedResponse({ description: ProfessorDescriptions.responses.invalidCredentials }),
    ApiBadRequestResponse({ description: ProfessorDescriptions.responses.accountAlreadyActive }),
  );
