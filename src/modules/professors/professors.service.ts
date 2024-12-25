import { Injectable, ConflictException, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Professor } from './schemas/professors.schema';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { ProfessorResponseDto } from './dto/professor-response.dto';
import { UpdateProfessorDto } from './dto/update-professor.dto';
import { InvalidEmailDomainException } from './exceptions/invalid-email-domain.exception';
import { InvalidPasswordFormatException } from './exceptions/invalid-password-format.exception';
import { InvalidAdminPasswordException } from './exceptions/password.exception';
import { ReactivateAccountDto } from './dto/reactivate-account.dto';


@Injectable()
export class ProfessorsService {
  constructor(
    @InjectModel(Professor.name) private professorModel: Model<Professor>,
    private configService: ConfigService,
  ) {}

  async create(createProfessorDto: CreateProfessorDto): Promise<ProfessorResponseDto> {
    // 1. Verify admin password first
    const correctAdminPassword = this.configService.get<string>('ADMIN_PASSWORD');
    if (createProfessorDto.adminPassword !== correctAdminPassword) {
      throw new InvalidAdminPasswordException();
    }
  
    // 2. Validate email domain using the EmailDomainPipe logic
    const validDomains = ['@miami.edu', '@med.miami.edu', '@cd.miami.edu'];
    if (!validDomains.some(domain => createProfessorDto.email.endsWith(domain))) {
      throw new InvalidEmailDomainException();
    }
  
    // 3. Check if email already exists
    const existingProfessor = await this.professorModel.findOne({ 
      email: createProfessorDto.email 
    });
    
    if (existingProfessor) {
      throw new ConflictException({
        statusCode: 409,
        message: 'Email already exists',
        error: 'Conflict'
      });
    }
  
    // 4. Validate password
    const passwordRequirements = this.validatePassword(createProfessorDto.password);
    if (passwordRequirements.length > 0) {
      throw new InvalidPasswordFormatException(passwordRequirements);
    }
  
    // Create professor if all validations pass
    const hashedPassword = await bcrypt.hash(createProfessorDto.password, 10);
    const { adminPassword: _, ...professorData } = createProfessorDto;
    
    const newProfessor = await this.professorModel.create({
      ...professorData,
      password: hashedPassword,
      isActive: true,
    });
  
    const { password: __, ...result } = newProfessor.toObject();
    return result as ProfessorResponseDto;
  }
  
  private validatePassword(password: string): string[] {
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
  
    return Object.entries(requirements)
      .filter(([_, { met }]) => !met)
      .map(([_, { message }]) => message);
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

  async reactivateAccount(reactivateAccountDto: ReactivateAccountDto): Promise<void> {
    const { email, password, adminPassword } = reactivateAccountDto;
  
    // Verify admin password
    const correctAdminPassword = this.configService.get<string>('ADMIN_PASSWORD');
    if (adminPassword !== correctAdminPassword) {
      throw new InvalidAdminPasswordException();
    }
  
    // Find professor
    const professor = await this.professorModel.findOne({ email });
    if (!professor) {
      throw new UnauthorizedException('Invalid credentials');
    }
  
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, professor.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
  
    // Check if account is already active
    if (professor.isActive) {
      throw new BadRequestException('Account is already active');
    }
  
    // Reactivate account
    await this.professorModel.findByIdAndUpdate(professor.id, {
      isActive: true
    });
  }
}