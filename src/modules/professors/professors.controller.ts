import { 
  Controller, 
  Post, 
  Body, 
  HttpCode, 
  HttpStatus, 
  Delete, 
  Patch, 
  UseGuards,
  Get 
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiOkResponse
} from '@nestjs/swagger';
import { ProfessorsService } from './professors.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetProfessor } from './decorators/get-professor.decorator';
import { Professor } from './schemas/professors.schema';
import { UpdateProfessorDto } from './dto/update-professor.dto';
import { ProfessorResponseDto } from './dto/professor-response.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { ReactivateAccountDto } from './dto/reactivate-account.dto';

@ApiTags('Professors')
@Controller('professors')
@ApiBearerAuth()
export class ProfessorsController {
  constructor(private readonly professorsService: ProfessorsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new professor' })
  @ApiResponse({ 
    status: 201, 
    description: 'Professor successfully created',
    type: ProfessorResponseDto 
  })
  @ApiResponse({ status: 401, description: 'Invalid admin password' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 409, description: 'Username or email already exists' })
  async create(@Body() createProfessorDto: CreateProfessorDto): Promise<ProfessorResponseDto> {
    return this.professorsService.create(createProfessorDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get professor profile' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns the professor profile',
    type: ProfessorResponseDto 
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async getProfile(@GetProfessor() professor: Professor): Promise<ProfessorResponseDto> {
    return this.professorsService.getProfile(professor.id);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update professor profile' })
  @ApiResponse({ 
    status: 200, 
    description: 'Profile updated successfully',
    type: ProfessorResponseDto 
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  async updateProfile(
    @GetProfessor() professor: Professor,
    @Body() updateProfileDto: UpdateProfessorDto
  ): Promise<ProfessorResponseDto> {
    return this.professorsService.updateProfile(professor.id, updateProfileDto);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change professor password' })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiUnauthorizedResponse({ description: 'Invalid current password' })
  @ApiBadRequestResponse({ description: 'Invalid password format' })
  async changePassword(
    @GetProfessor() professor: Professor,
    @Body() changePasswordDto: ChangePasswordDto
  ): Promise<void> {
    await this.professorsService.changePassword(
      professor.id,
      changePasswordDto.currentPassword,
      changePasswordDto.newPassword
    );
  }

  @Delete('deactivate')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Deactivate professor account' })
  @ApiResponse({ status: 200, description: 'Account deactivated successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async deactivateAccount(@GetProfessor() professor: Professor): Promise<void> {
    await this.professorsService.deactivateAccount(professor.id);
  }

  @Post('reactivate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reactivate professor account' })
  @ApiResponse({ status: 200, description: 'Account reactivated successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials or admin password' })
  @ApiBadRequestResponse({ description: 'Account is already active' })
  async reactivateAccount(
    @Body() reactivateAccountDto: ReactivateAccountDto
  ): Promise<void> {
    await this.professorsService.reactivateAccount(reactivateAccountDto);
  }
}