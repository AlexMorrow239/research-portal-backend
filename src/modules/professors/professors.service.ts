import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';

import { CreateProfessorDto } from '../../common/dto/professors/create-professor.dto';
import { ProfessorResponseDto } from '../../common/dto/professors/professor-response.dto';
import { ReactivateAccountDto } from '../../common/dto/professors/reactivate-account.dto';
import { UpdateProfessorDto } from '../../common/dto/professors/update-professor.dto';
import { InvalidEmailDomainException } from './exceptions/invalid-email-domain.exception';
import { InvalidPasswordFormatException } from './exceptions/invalid-password-format.exception';
import { InvalidAdminPasswordException } from './exceptions/password.exception';
import { Professor } from './schemas/professors.schema';

@Injectable()
export class ProfessorsService {
  private readonly logger = new Logger(ProfessorsService.name);

  constructor(
    @InjectModel(Professor.name) private professorModel: Model<Professor>,
    private configService: ConfigService,
  ) {}

  async create(createProfessorDto: CreateProfessorDto): Promise<ProfessorResponseDto> {
    try {
      // 1. Verify admin password first
      const correctAdminPassword = this.configService.get<string>('ADMIN_PASSWORD');
      if (createProfessorDto.adminPassword !== correctAdminPassword) {
        this.logger.warn('Invalid admin password attempt during professor creation');
        throw new InvalidAdminPasswordException();
      }

      // 2. Validate email domain
      const validDomains = ['@miami.edu', '@med.miami.edu', '@cd.miami.edu'];
      if (!validDomains.some((domain) => createProfessorDto.email.endsWith(domain))) {
        this.logger.warn(`Invalid email domain attempt: ${createProfessorDto.email}`);
        throw new InvalidEmailDomainException();
      }

      // 3. Check if email already exists
      const existingProfessor = await this.professorModel.findOne({
        email: createProfessorDto.email,
      });

      if (existingProfessor) {
        this.logger.warn(
          `Attempted to create duplicate professor account: ${createProfessorDto.email}`,
        );
        throw new ConflictException({
          statusCode: 409,
          message: 'Email already exists',
          error: 'Conflict',
        });
      }

      // 4. Validate password
      const passwordRequirements = this.validatePassword(createProfessorDto.password);
      if (passwordRequirements.length > 0) {
        this.logger.warn('Invalid password format during professor creation');
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

      this.logger.log(`Successfully created new professor account: ${createProfessorDto.email}`);

      const { password: __, ...result } = newProfessor.toObject();
      return result as ProfessorResponseDto;
    } catch (error) {
      if (
        error instanceof InvalidAdminPasswordException ||
        error instanceof InvalidEmailDomainException ||
        error instanceof InvalidPasswordFormatException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      this.logger.error('Failed to create professor account', {
        email: createProfessorDto.email,
        error: error.message,
        stack: error.stack,
      });
      throw new InternalServerErrorException('Failed to create professor account');
    }
  }

  async updateProfile(
    professorId: string,
    updateProfileDto: UpdateProfessorDto,
  ): Promise<ProfessorResponseDto> {
    try {
      const professor = await this.professorModel.findById(professorId);

      if (!professor) {
        throw new NotFoundException('Professor not found');
      }

      const updatedProfessor = await this.professorModel.findByIdAndUpdate(
        professorId,
        { $set: updateProfileDto },
        { new: true },
      );

      this.logger.log(`Successfully updated profile for professor: ${professorId}`);

      const { password: _, ...result } = updatedProfessor.toObject();
      return result as ProfessorResponseDto;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.logger.error('Failed to update professor profile', {
        professorId,
        error: error.message,
        stack: error.stack,
      });
      throw new InternalServerErrorException('Failed to update profile');
    }
  }

  async deactivateAccount(professorId: string): Promise<void> {
    try {
      const professor = await this.professorModel.findById(professorId);

      if (!professor) {
        throw new NotFoundException('Professor not found');
      }

      await this.professorModel.findByIdAndUpdate(professorId, {
        isActive: false,
      });

      this.logger.log(`Successfully deactivated account for professor: ${professorId}`);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.logger.error('Failed to deactivate professor account', {
        professorId,
        error: error.message,
        stack: error.stack,
      });
      throw new InternalServerErrorException('Failed to deactivate account');
    }
  }

  async changePassword(
    professorId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    try {
      const professor = await this.professorModel.findById(professorId);

      if (!professor) {
        throw new NotFoundException('Professor not found');
      }

      const isPasswordValid = await bcrypt.compare(currentPassword, professor.password);
      if (!isPasswordValid) {
        this.logger.warn(`Invalid current password attempt for professor: ${professorId}`);
        throw new UnauthorizedException(
          'Current password is incorrect. Please try again or use the "Forgot Password" feature if you cannot remember your password.',
        );
      }

      const isSamePassword = await bcrypt.compare(newPassword, professor.password);
      if (isSamePassword) {
        throw new BadRequestException(
          'New password must be different from your current password. ' +
            "Please choose a password you haven't used before.",
        );
      }

      const passwordRequirements = this.validatePassword(newPassword);
      if (passwordRequirements.length > 0) {
        throw new InvalidPasswordFormatException(passwordRequirements);
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.professorModel.findByIdAndUpdate(professorId, {
        password: hashedPassword,
      });

      this.logger.log(`Successfully changed password for professor: ${professorId}`);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException ||
        error instanceof InvalidPasswordFormatException
      ) {
        throw error;
      }

      this.logger.error('Failed to change professor password', {
        professorId,
        error: error.message,
        stack: error.stack,
      });
      throw new InternalServerErrorException('Failed to change password');
    }
  }

  private validatePassword(password: string): string[] {
    const requirements = {
      minLength: { met: password.length >= 8, message: 'at least 8 characters' },
      upperCase: { met: /[A-Z]/.test(password), message: 'one uppercase letter' },
      lowerCase: { met: /[a-z]/.test(password), message: 'one lowercase letter' },
      numbers: { met: /\d/.test(password), message: 'one number' },
      specialChar: {
        met: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        message: 'one special character (!@#$%^&*(),.?":{}|<>)',
      },
    };

    return Object.entries(requirements)
      .filter(([_, { met }]) => !met)
      .map(([_, { message }]) => message);
  }

  async getProfile(professorId: string): Promise<ProfessorResponseDto> {
    try {
      const professor = await this.professorModel.findById(professorId);

      if (!professor) {
        throw new NotFoundException('Professor not found');
      }

      const { password: _, ...result } = professor.toObject();
      return result as ProfessorResponseDto;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.logger.error('Failed to get professor profile', {
        professorId,
        error: error.message,
        stack: error.stack,
      });
      throw new InternalServerErrorException('Failed to retrieve profile');
    }
  }

  async reactivateAccount(reactivateAccountDto: ReactivateAccountDto): Promise<void> {
    try {
      const { email, password, adminPassword } = reactivateAccountDto;

      const correctAdminPassword = this.configService.get<string>('ADMIN_PASSWORD');
      if (adminPassword !== correctAdminPassword) {
        this.logger.warn('Invalid admin password attempt during account reactivation');
        throw new InvalidAdminPasswordException();
      }

      const professor = await this.professorModel.findOne({ email });
      if (!professor) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(password, professor.password);
      if (!isPasswordValid) {
        this.logger.warn(`Invalid password attempt during reactivation for email: ${email}`);
        throw new UnauthorizedException('Invalid credentials');
      }

      if (professor.isActive) {
        throw new BadRequestException('Account is already active');
      }

      await this.professorModel.findByIdAndUpdate(professor.id, {
        isActive: true,
      });

      this.logger.log(`Successfully reactivated account for professor: ${email}`);
    } catch (error) {
      if (
        error instanceof InvalidAdminPasswordException ||
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      this.logger.error('Failed to reactivate professor account', {
        email: reactivateAccountDto.email,
        error: error.message,
        stack: error.stack,
      });
      throw new InternalServerErrorException('Failed to reactivate account');
    }
  }
}
