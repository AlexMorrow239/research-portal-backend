import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';

import { Professor } from '../professors/schemas/professors.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Professor.name) private professorModel: Model<Professor>,
    private jwtService: JwtService,
  ) {}

  async validateProfessor(email: string, password: string) {
    let professor;
    try {
      professor = await this.professorModel.findOne({ email });

      if (!professor) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(password, professor.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Check if professor is active
      if (!professor.isActive) {
        throw new UnauthorizedException('Account is inactive');
      }

      return professor;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async login(email: string, password: string) {
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
  }
}
