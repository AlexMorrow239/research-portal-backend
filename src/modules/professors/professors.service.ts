import { Injectable, ConflictException, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Professor } from './schemas/professors.schema';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { ProfessorResponseDto } from './dto/professor-response.dto';


@Injectable()
export class ProfessorsService {
  constructor(
    @InjectModel(Professor.name) private professorModel: Model<Professor>,
    private configService: ConfigService,
  ) {}

  async create(createProfessorDto: CreateProfessorDto): Promise<ProfessorResponseDto> {
    const { username, email, adminPassword } = createProfessorDto;
    
    // Verify admin password
    const correctAdminPassword = this.configService.get<string>('ADMIN_PASSWORD');
    if (adminPassword !== correctAdminPassword) {
      throw new UnauthorizedException('Invalid admin password');
    }
    
    // Validate email domain
    if (!email.endsWith('@miami.edu')) {
      throw new BadRequestException('Email must be a valid miami.edu address');
    }

    // Check if professor already exists
    const existingProfessor = await this.professorModel.findOne({
      $or: [
        { username },
        { email },
      ],
    });
    
    if (existingProfessor) {
      if (existingProfessor.username === username) {
        throw new ConflictException('Username already exists');
      }
      throw new ConflictException('Email already exists');
    }

    // Validate password strength
    this.validatePassword(createProfessorDto.password);
  
    // Hash password
    const hashedPassword = await bcrypt.hash(createProfessorDto.password, 10);
  
    // Remove adminPassword before saving
    const { adminPassword: _, ...professorData } = createProfessorDto;
    
    // Create new professor
    const newProfessor = await this.professorModel.create({
      ...professorData,
      password: hashedPassword,
      isActive: true,
    });

    // Remove sensitive data from response
    const { password: __, ...result } = newProfessor.toObject();
    return {
      ...result,
      id: result._id,
      createdAt: newProfessor.createdAt,
      updatedAt: newProfessor.updatedAt
    } as ProfessorResponseDto;
  }

  private validatePassword(password: string): void {
    if (password.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters long');
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
      throw new BadRequestException(
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      );
    }
  }

  async findByUsername(username: string): Promise<Professor> {
    const professor = await this.professorModel.findOne({ username }).exec();
    
    if (!professor) {
      throw new NotFoundException('Professor not found');
    }
    
    return professor;
  }
}