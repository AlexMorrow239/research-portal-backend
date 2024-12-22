import { Injectable, ConflictException, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Professor } from './schemas/professors.schema';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { ProfessorResponseDto } from './dto/professor-response.dto';
import { UpdateProfessorDto } from './dto/update-professor.dto';


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

  async updateProfile(
    professorId: string,
    updateProfileDto: UpdateProfessorDto
  ): Promise<ProfessorResponseDto> {
    const professor = await this.professorModel.findById(professorId);
    
    if (!professor) {
      throw new NotFoundException('Professor not found');
    }
  
    const updatedProfessor = await this.professorModel.findByIdAndUpdate(
      professorId,
      { $set: updateProfileDto },
      { new: true }
    );
  
    const { password: _, ...result } = updatedProfessor.toObject();
    return result as ProfessorResponseDto;
  }

  async deactivateAccount(professorId: string): Promise<void> {
    const professor = await this.professorModel.findById(professorId);
    
    if (!professor) {
      throw new NotFoundException('Professor not found');
    }
  
    await this.professorModel.findByIdAndUpdate(professorId, {
      isActive: false
    });
  }
  
  private validatePassword(password: string): void {
    const requirements = {
      minLength: { met: password.length >= 8, message: 'at least 8 characters' },
      upperCase: { met: /[A-Z]/.test(password), message: 'one uppercase letter' },
      lowerCase: { met: /[a-z]/.test(password), message: 'one lowercase letter' },
      numbers: { met: /\d/.test(password), message: 'one number' },
      specialChar: { 
        met: /[!@#$%^&*(),.?":{}|<>]/.test(password), 
        message: 'one special character (!@#$%^&*(),.?":{}|<>)'
      }
    };
  
    const failedRequirements = Object.entries(requirements)
      .filter(([_, { met }]) => !met)
      .map(([_, { message }]) => message);
  
    if (failedRequirements.length > 0) {
      const missingRequirements = failedRequirements.join(', ');
      throw new BadRequestException(
        `Password must contain ${missingRequirements}. ` +
        'Example of valid password: "Research2024!"'
      );
    }
  }
  
  async changePassword(
    professorId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const professor = await this.professorModel.findById(professorId);
    
    if (!professor) {
      throw new NotFoundException('Professor not found');
    }
  
    const isPasswordValid = await bcrypt.compare(currentPassword, professor.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'Current password is incorrect. Please try again or use the "Forgot Password" feature if you cannot remember your password.'
      );
    }
  
    // Check if new password is same as current password
    const isSamePassword = await bcrypt.compare(newPassword, professor.password);
    if (isSamePassword) {
      throw new BadRequestException(
        'New password must be different from your current password. ' +
        'Please choose a password you haven\'t used before.'
      );
    }
  
    this.validatePassword(newPassword);
    const hashedPassword = await bcrypt.hash(newPassword, 10);
  
    await this.professorModel.findByIdAndUpdate(professorId, {
      password: hashedPassword
    });
  }

  async getProfile(professorId: string): Promise<ProfessorResponseDto> {
    const professor = await this.professorModel.findById(professorId);
    
    if (!professor) {
      throw new NotFoundException('Professor not found');
    }
  
    const { password: _, ...result } = professor.toObject();
    return result as ProfessorResponseDto;
  }



  async findByUsername(username: string): Promise<Professor> {
    const professor = await this.professorModel.findOne({ username }).exec();
    
    if (!professor) {
      throw new NotFoundException('Professor not found');
    }
    
    return professor;
  }
}