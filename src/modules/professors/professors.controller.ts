import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { ProfessorResponseDto } from './dto/professor-response.dto';
import { ProfessorsService } from './professors.service';
import { ValidateAdminPassword } from './decorators/admin-password.decorator';

@ApiTags('Professors')
@Controller('professors')
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
  async create(
    @Body() createProfessorDto: CreateProfessorDto,
    @ValidateAdminPassword() adminPassword: string,
  ): Promise<ProfessorResponseDto> {
    return this.professorsService.create(createProfessorDto);
  }
}