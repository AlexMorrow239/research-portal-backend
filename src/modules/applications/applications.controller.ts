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
  Res
} from '@nestjs/common';
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
  ApiNotFoundResponse
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { application, Response } from 'express';
import { ApplicationsService } from './applications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetProfessor } from '../professors/decorators/get-professor.decorator';
import { Professor } from '../professors/schemas/professors.schema';
import { ApplicationStatus } from './schemas/applications.schema';
import { createApplicationExamples, updateApplicationStatusExamples } from '@/common/swagger';
import { ApplicationDescriptions } from '@/common/swagger/descriptions/applications.description';
import { ApplicationSchemas } from '@/common/swagger/schemas/application.schemas';


@ApiTags('Applications')
@Controller('projects/:projectId/applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('resume'))
  @ApiOperation(ApplicationDescriptions.create)
  @ApiConsumes('multipart/form-data')
  @ApiBody(ApplicationSchemas.Create)
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Application submitted successfully',
    ...ApplicationSchemas.Response
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid application data or file',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { 
          type: 'array', 
          items: { type: 'string' },
          example: [
            'firstName is required',
            'Email must be from @miami.edu domain',
            'GPA must be between 0 and 4.0',
            'expectedGraduation must be in YYYY-MM-DD format',
            'Resume file must be PDF, DOC, or DOCX format',
            'File size exceeds 5MB limit'
          ]
        },
        error: { type: 'string', example: 'Bad Request' }
      }
    }
  })
  @ApiNotFoundResponse({ 
    description: 'Project not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Project not found' },
        error: { type: 'string', example: 'Not Found' }
      }
    }
  })
  async create(
    @Param('projectId') projectId: string,
    @Body('application') applicationData: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /(pdf|doc|docx)$/ }),
        ],
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    resume: Express.Multer.File,
  ) {
    return this.applicationsService.create(
      projectId,
      JSON.parse(applicationData),
      resume,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation(ApplicationDescriptions.findAll)
  @ApiParam({
    name: 'projectId',
    description: 'ID of the project',
    example: '507f1f77bcf86cd799439011'
  })
  @ApiQuery({ 
    name: 'status', 
    enum: ApplicationStatus, 
    required: false,
    description: 'Filter applications by status' 
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'List of applications retrieved successfully' 
  })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiNotFoundResponse({ description: 'Project not found' })
  async findAll(
    @Param('projectId') projectId: string,
    @GetProfessor() professor: Professor,
    @Query('status') status?: ApplicationStatus,
  ) {
    return this.applicationsService.findProjectApplications(
      professor.id, 
      projectId,
      status
    );
  }

  @Patch(':applicationId/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation(ApplicationDescriptions.updateStatus)
  @ApiParam({
    name: 'projectId',
    description: 'ID of the project',
    example: '507f1f77bcf86cd799439011'
  })
  @ApiParam({
    name: 'applicationId',
    description: 'ID of the application',
    example: '507f1f77bcf86cd799439012'
  })
  @ApiBody({
    schema: {
      examples: updateApplicationStatusExamples
    }
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Application status updated successfully' 
  })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiNotFoundResponse({ description: 'Application not found' })
  @ApiBadRequestResponse({ description: 'Invalid status' })
  async updateStatus(
    @Param('applicationId') applicationId: string,
    @GetProfessor() professor: Professor,
    @Body() updateStatusDto: { status: ApplicationStatus; professorNotes?: string }
  ) {
    return this.applicationsService.updateStatus(
      professor.id,
      applicationId,
      updateStatusDto.status,
      updateStatusDto.professorNotes
    );
  }

  @Get(':applicationId/resume')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation(ApplicationDescriptions.downloadResume)
  @ApiParam({
    name: 'projectId',
    description: 'ID of the project',
    example: '507f1f77bcf86cd799439011'
  })
  @ApiParam({
    name: 'applicationId',
    description: 'ID of the application',
    example: '507f1f77bcf86cd799439012'
  })
  @ApiResponse({ 
    status: HttpStatus.OK,
    description: 'Resume file',
    content: {
      'application/pdf': {},
      'application/msword': {},
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {}
    }
  })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiNotFoundResponse({ description: 'Resume file not found' })
  async downloadResume(
    @Param('projectId') projectId: string,
    @Param('applicationId') applicationId: string,
    @GetProfessor() professor: Professor,
    @Res() res: Response
  ) {
    const fileData = await this.applicationsService.getResume(professor.id, applicationId);
    
    res.setHeader('Content-Type', fileData.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${fileData.fileName}"`);
    return res.send(fileData.file);
  }
}