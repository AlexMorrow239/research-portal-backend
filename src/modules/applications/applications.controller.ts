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
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { CreateApplicationDto, UpdateApplicationStatusDto } from '@/common/dto/applications';
import { ApplicationStatus } from '@/common/enums';
import { ParseFormJsonPipe } from '@/common/pipes/parse-form-json.pipe';
import {
  ApiCreateApplication,
  ApiFindAllApplications,
  ApiUpdateApplicationStatus,
  ApiDownloadResume,
} from '@/common/swagger/decorators/applications.decorator';

import { ApplicationsService } from './applications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetProfessor } from '../professors/decorators/get-professor.decorator';
import { Professor } from '../professors/schemas/professors.schema';

@ApiTags('Applications')
@Controller('projects/:projectId/applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('resume'))
  @ApiCreateApplication()
  async create(
    @Param('projectId') projectId: string,
    @Body(new ParseFormJsonPipe()) body: { application: CreateApplicationDto },
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
    return await this.applicationsService.create(projectId, body.application, resume);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiFindAllApplications()
  async findAll(
    @Param('projectId') projectId: string,
    @GetProfessor() professor: Professor,
    @Query('status') status?: ApplicationStatus,
  ) {
    return await this.applicationsService.findProjectApplications(professor.id, projectId, status);
  }

  @Patch(':applicationId/status')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiUpdateApplicationStatus()
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
  @ApiDownloadResume()
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
