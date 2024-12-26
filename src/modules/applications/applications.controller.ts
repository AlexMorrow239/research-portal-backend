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
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  Res,
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
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApplicationsService } from './applications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetProfessor } from '../professors/decorators/get-professor.decorator';
import { Professor } from '../professors/schemas/professors.schema';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { ApplicationStatus } from './schemas/applications.schema';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { Response } from 'express';
  
  @ApiTags('Applications')
  @Controller('projects/:projectId/applications')
  export class ApplicationsController {
    constructor(private readonly applicationsService: ApplicationsService) {}
  
    @Post()
    @UseInterceptors(FileInterceptor('resume'))
    @ApiOperation({ summary: 'Submit a new application' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
      schema: {
        type: 'object',
        required: ['application', 'resume'],
        properties: {
          application: {
            type: 'string',
            description: 'Application data as JSON string',
            example: JSON.stringify({
              studentInfo: {
                name: {
                  firstName: 'John',
                  lastName: 'Doe'
                },
                email: 'student@miami.edu',
                major: 'Computer Science',
                gpa: 3.5,
                expectedGraduation: '2024-12-24'
              },
              statement: 'I am interested in this research project because...'
            })
          },
          resume: {
            type: 'string',
            format: 'binary',
            description: 'PDF or Word document (max 5MB)'
          }
        }
      }
    })
    @ApiResponse({ status: 201, description: 'Application submitted successfully' })
    @ApiResponse({ status: 400, description: 'Invalid input or file' })
    @ApiResponse({ status: 404, description: 'Project not found' })
    async create(
      @Param('projectId') projectId: string,
      @Body('application') applicationData: string,
      @UploadedFile(
        new ParseFilePipe({
          validators: [
            new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
            new FileTypeValidator({ fileType: /(pdf|doc|docx)$/ }),
          ],
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
      )
      resume: Express.Multer.File,
    ) {
      try {
        // Parse the application JSON string
        const parsedData = JSON.parse(applicationData);
        
        // Transform the plain object into a DTO instance
        const createApplicationDto = plainToClass(CreateApplicationDto, parsedData);
        
        // Validate the DTO
        const errors = await validate(createApplicationDto, { 
          whitelist: true,
          forbidNonWhitelisted: true,
          validationError: { target: false }
        });

        if (errors.length > 0) {
          throw new BadRequestException({
            message: 'Validation failed',
            errors: errors.map(error => ({
              property: error.property,
              constraints: error.constraints
            }))
          });
        }
    
        return await this.applicationsService.create(
          projectId,
          createApplicationDto,
          resume,
        );
      } catch (error) {
        if (error instanceof SyntaxError) {
          throw new BadRequestException('Invalid JSON format in application data');
        }
        if (error instanceof BadRequestException || error instanceof NotFoundException) {
          throw error;
        }
        throw new InternalServerErrorException('Error processing application');
      }
    }
  
    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all applications for a project' })
    @ApiQuery({ name: 'status', enum: ApplicationStatus, required: false })
    @ApiResponse({ status: 200, description: 'List of applications' })
    @ApiResponse({ status: 403, description: 'Not project owner' })
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
    @ApiOperation({ summary: 'Update application status' })
    @ApiParam({ name: 'applicationId', description: 'Application ID' })
    @ApiResponse({ status: 200, description: 'Application status updated' })
    @ApiResponse({ status: 403, description: 'Not project owner' })
    @ApiResponse({ status: 404, description: 'Application not found' })
    async updateStatus(
      @Param('projectId') projectId: string,
      @Param('applicationId') applicationId: string,
      @GetProfessor() professor: Professor,
      @Body() updateStatusDto: UpdateApplicationStatusDto,
    ) {
      try {
        const result = await this.applicationsService.updateStatus(
          professor.id,
          applicationId,
          updateStatusDto.status,
          updateStatusDto.professorNotes,
        );
        return result;
      } catch (error) {
        console.error('Error updating application status:', error);
        if (error instanceof NotFoundException) {
          throw error;
        }
        throw new InternalServerErrorException(
          'Failed to update application status: ' + error.message
        );
      }
    }
  
    @Get(':applicationId/resume')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Download application resume' })
    @ApiResponse({ 
      status: 200, 
      description: 'Resume file',
      content: {
        'application/pdf': {},
        'application/msword': {},
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {}
      }
    })
    @ApiResponse({ status: 403, description: 'Not project owner' })
    @ApiResponse({ status: 404, description: 'File not found' })
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