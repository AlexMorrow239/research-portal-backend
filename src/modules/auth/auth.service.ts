import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';

import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';

import { ErrorHandler } from '@/common/utils/error-handler.util';

import { Professor } from '../professors/schemas/professors.schema';

// Handles authentication logic and JWT operations
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(Professor.name) private professorModel: Model<Professor>,
    private jwtService: JwtService,
  ) {}

  // Validates professor credentials
  async validateProfessor(email: string, password: string) {
    try {
      const professor = await this.professorModel.findOne({ email });

      if (!professor) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(password, professor.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      if (!professor.isActive) {
        throw new UnauthorizedException('Account is inactive');
      }

      return professor;
    } catch (error) {
      ErrorHandler.handleServiceError(this.logger, error, 'validate professor', { email }, [
        UnauthorizedException,
      ]);
    }
  }

  // Handles professor login and JWT token generation
  async login(email: string, password: string) {
    try {
      const professor = await this.validateProfessor(email, password);

      const payload = {
        sub: professor._id,
        email: professor.email,
      };

      return {
        accessToken: this.jwtService.sign(payload),
        professor: {
          id: professor._id,
          email: professor.email,
          name: professor.name,
          department: professor.department,
          title: professor.title,
        },
      };
    } catch (error) {
      ErrorHandler.handleServiceError(this.logger, error, 'login professor', { email }, [
        UnauthorizedException,
      ]);
    }
  }
}
