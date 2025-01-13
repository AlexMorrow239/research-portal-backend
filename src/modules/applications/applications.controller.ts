import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  Res,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

import { Response } from 'express';

import {
  ApiCreateApplication,
  ApiDownloadResume,
  ApiFindAllApplications,
  ApiUpdateApplicationStatus,
} from '@/common/docs/decorators/applications.decorator';
import { CreateApplicationDto, UpdateApplicationStatusDto } from '@/common/dto/applications';
import { ApplicationStatus } from '@/common/enums';
import { ParseFormJsonPipe } from '@/common/pipes/parse-form-json.pipe';
import { DownloadTokenService } from '@/modules/file-storage/download-token.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetProfessor } from '../professors/decorators/get-professor.decorator';
import { Professor } from '../professors/schemas/professors.schema';

import { ApplicationsService } from './applications.service';

@ApiTags('Applications')
@Controller('projects/:projectId/applications')
export class ApplicationsController {
  constructor(
    private readonly applicationsService: ApplicationsService,
    private readonly downloadTokenService: DownloadTokenService,
  ) {}

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

  @Get('download/:token')
  async downloadResumeWithToken(@Param('token') token: string, @Res() res: Response) {
    const tokenData = await this.downloadTokenService.verifyToken(token);
    if (!tokenData) {
      throw new UnauthorizedException('Invalid or expired download token');
    }

    const fileData = await this.applicationsService.getResume(
      tokenData.professorId,
      tokenData.applicationId,
    );

    res.setHeader('Content-Type', fileData.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${fileData.fileName}"`);
    return res.send(fileData.file);
  }
}
