import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Delete,
  Patch,
  UseGuards,
  Get,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiConflictResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

import {
  ChangePasswordDto,
  CreateProfessorDto,
  ProfessorResponseDto,
  ReactivateAccountDto,
  UpdateProfessorDto,
} from '@/common/dto/professors';
import { createProfessorExamples, updateProfessorExamples } from '@/common/swagger';
import { ProfessorDescriptions } from '@/common/swagger/descriptions/professors.description';
import {
  changePasswordExamples,
  reactivateExamples,
} from '@/common/swagger/examples/professor.examples';

import { GetProfessor } from './decorators/get-professor.decorator';
import { ProfessorsService } from './professors.service';
import { Professor } from './schemas/professors.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Professors')
@Controller('professors')
@ApiBearerAuth()
export class ProfessorsController {
  constructor(private readonly professorsService: ProfessorsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation(ProfessorDescriptions.create)
  @ApiBody({
    type: CreateProfessorDto,
    examples: createProfessorExamples,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Professor successfully created',
    type: ProfessorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid admin password',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Invalid admin password' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiConflictResponse({
    description: 'Email already exists',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 409 },
        message: { type: 'string', example: 'Email already exists' },
        error: { type: 'string', example: 'Conflict' },
      },
    },
  })
  async create(@Body() createProfessorDto: CreateProfessorDto): Promise<ProfessorResponseDto> {
    return await this.professorsService.create(createProfessorDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation(ProfessorDescriptions.getProfile)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Profile retrieved successfully',
    type: ProfessorResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async getProfile(@GetProfessor() professor: Professor): Promise<ProfessorResponseDto> {
    return await this.professorsService.getProfile(professor.id);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation(ProfessorDescriptions.updateProfile)
  @ApiBody({
    type: UpdateProfessorDto,
    examples: updateProfessorExamples,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Profile updated successfully',
    type: ProfessorResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  async updateProfile(
    @GetProfessor() professor: Professor,
    @Body() updateProfileDto: UpdateProfessorDto,
  ): Promise<ProfessorResponseDto> {
    return await this.professorsService.updateProfile(professor.id, updateProfileDto);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation(ProfessorDescriptions.changePassword)
  @ApiBody({
    type: ChangePasswordDto,
    examples: changePasswordExamples,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Password changed successfully',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid current password' })
  @ApiBadRequestResponse({ description: 'Invalid password format' })
  async changePassword(
    @GetProfessor() professor: Professor,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    await this.professorsService.changePassword(
      professor.id,
      changePasswordDto.currentPassword,
      changePasswordDto.newPassword,
    );
  }

  @Delete('deactivate')
  @UseGuards(JwtAuthGuard)
  @ApiOperation(ProfessorDescriptions.deactivateAccount)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Account deactivated successfully',
  })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async deactivateAccount(@GetProfessor() professor: Professor): Promise<void> {
    await this.professorsService.deactivateAccount(professor.id);
  }

  @Post('reactivate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation(ProfessorDescriptions.reactivateAccount)
  @ApiBody({
    type: ReactivateAccountDto,
    examples: reactivateExamples,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Account reactivated successfully',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials or admin password' })
  @ApiBadRequestResponse({ description: 'Account is already active' })
  async reactivateAccount(@Body() reactivateAccountDto: ReactivateAccountDto): Promise<void> {
    await this.professorsService.reactivateAccount(reactivateAccountDto);
  }
}
