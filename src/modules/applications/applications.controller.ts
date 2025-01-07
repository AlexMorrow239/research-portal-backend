import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Patch,
  Param,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Query,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { Response } from 'express';

import {
  ApplicationResponseDto,
  CreateApplicationDto,
  UpdateApplicationStatusDto,
} from '@/common/dto/applications';
import { ApplicationStatus } from '@/common/enums';

import { ApplicationsService } from './applications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetProfessor } from '../professors/decorators/get-professor.decorator';
import { Professor } from '../professors/schemas/professors.schema';

@ApiTags('Applications')
@Controller('projects/:projectId/applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('resume'))
  @ApiOperation({
    summary: 'Submit new application',
    description: 'Submit a new application for a research project with resume attachment',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['application', 'resume'],
      properties: {
        application: {
          type: 'object',
          $ref: '#/components/schemas/CreateApplicationDto',
        },
        resume: {
          type: 'string',
          format: 'binary',
          description: 'Resume file (PDF, DOC, or DOCX, max 5MB)',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Application submitted successfully',
    type: ApplicationResponseDto,
  })
  @ApiBadRequestResponse({
    description:
      'Invalid request (Invalid data format, project not accepting applications, or deadline passed)',
  })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid resume file (Wrong type or size)',
  })
  @ApiNotFoundResponse({ description: 'Project not found' })
  async create(
    @Param('projectId') projectId: string,
    @Body('application') createApplicationDto: CreateApplicationDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /(pdf|doc|docx)$/ }),
        ],
      }),
    )
    resume: Express.Multer.File,
  ) {
    return await this.applicationsService.create(projectId, createApplicationDto, resume);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get project applications',
    description:
      'Retrieve all applications for a specific project. Only accessible by project owner.',
  })
  @ApiParam({
    name: 'projectId',
    description: 'Project identifier',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiQuery({
    name: 'status',
    enum: ApplicationStatus,
    required: false,
    description: 'Filter applications by status',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Applications retrieved successfully',
    type: [ApplicationResponseDto],
  })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiNotFoundResponse({ description: 'Project not found' })
  async findAll(
    @Param('projectId') projectId: string,
    @GetProfessor() professor: Professor,
    @Query('status') status?: ApplicationStatus,
  ) {
    return await this.applicationsService.findProjectApplications(professor.id, projectId, status);
  }

  @Patch(':applicationId/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update application status',
    description: 'Update the status of an application. Only accessible by project owner.',
  })
  @ApiParam({
    name: 'projectId',
    description: 'Project identifier',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiParam({
    name: 'applicationId',
    description: 'Application identifier',
    example: '507f1f77bcf86cd799439012',
  })
  @ApiBody({ type: UpdateApplicationStatusDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Application status updated successfully',
    type: ApplicationResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiNotFoundResponse({ description: 'Application not found' })
  @ApiBadRequestResponse({ description: 'Invalid status value' })
  async updateStatus(
    @Param('applicationId') applicationId: string,
    @GetProfessor() professor: Professor,
    @Body() updateStatusDto: UpdateApplicationStatusDto,
  ) {
    return await this.applicationsService.updateStatus(
      professor.id,
      applicationId,
      updateStatusDto.status,
    );
  }

  @Get(':applicationId/resume')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Download application resume',
    description: 'Download the resume file for an application. Only accessible by project owner.',
  })
  @ApiParam({
    name: 'projectId',
    description: 'Project identifier',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiParam({
    name: 'applicationId',
    description: 'Application identifier',
    example: '507f1f77bcf86cd799439012',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Resume file stream',
    content: {
      'application/pdf': {
        schema: { type: 'string', format: 'binary' },
      },
      'application/msword': {
        schema: { type: 'string', format: 'binary' },
      },
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
        schema: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiNotFoundResponse({ description: 'Resume file not found' })
  async downloadResume(
    @Param('projectId') projectId: string,
    @Param('applicationId') applicationId: string,
    @GetProfessor() professor: Professor,
    @Res() res: Response,
  ) {
    const fileData = await this.applicationsService.getResume(professor.id, applicationId);

    res.setHeader('Content-Type', fileData.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${fileData.fileName}"`);
    return res.send(fileData.file);
  }
}
