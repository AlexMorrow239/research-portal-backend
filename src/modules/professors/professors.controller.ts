import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import {
  ApiChangePassword,
  ApiCreateProfessor,
  ApiDeactivateAccount,
  ApiGetProfile,
  ApiReactivateAccount,
  ApiUpdateProfile,
} from '@/common/docs/decorators/professors.decorator';
import {
  ChangePasswordDto,
  CreateProfessorDto,
  ProfessorResponseDto,
  ReactivateAccountDto,
  UpdateProfessorDto,
} from '@/common/dto/professors';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { GetProfessor } from '@/modules/professors/decorators/get-professor.decorator';
import { ProfessorsService } from '@/modules/professors/professors.service';
import { Professor } from '@/modules/professors/schemas/professors.schema';

@ApiTags('Professors')
@Controller('professors')
@ApiBearerAuth()
export class ProfessorsController {
  constructor(private readonly professorsService: ProfessorsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreateProfessor()
  async create(@Body() createProfessorDto: CreateProfessorDto): Promise<ProfessorResponseDto> {
    return await this.professorsService.create(createProfessorDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiGetProfile()
  async getProfile(@GetProfessor() professor: Professor): Promise<ProfessorResponseDto> {
    return await this.professorsService.getProfile(professor.id);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @ApiUpdateProfile()
  async updateProfile(
    @GetProfessor() professor: Professor,
    @Body() updateProfileDto: UpdateProfessorDto,
  ): Promise<ProfessorResponseDto> {
    return await this.professorsService.updateProfile(professor.id, updateProfileDto);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiChangePassword()
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
  @ApiDeactivateAccount()
  async deactivateAccount(@GetProfessor() professor: Professor): Promise<void> {
    await this.professorsService.deactivateAccount(professor.id);
  }

  @Post('reactivate')
  @HttpCode(HttpStatus.OK)
  @ApiReactivateAccount()
  async reactivateAccount(@Body() reactivateAccountDto: ReactivateAccountDto): Promise<void> {
    await this.professorsService.reactivateAccount(reactivateAccountDto);
  }
}
