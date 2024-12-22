import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ProfessorsService } from '../professors/professors.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private professorsService: ProfessorsService,
    private jwtService: JwtService,
  ) {}

  async validateProfessor(username: string, password: string) {
    let professor;
    try {
      professor = await this.professorsService.findByUsername(username);
    } catch (error) {
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
  }

  async login(username: string, password: string) {
    
    const professor = await this.validateProfessor(username, password);

    const payload = {
      sub: professor._id,
      username: professor.username,
      email: professor.email,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      professor: {
        id: professor._id,
        username: professor.username,
        name: professor.name,
        email: professor.email,
        department: professor.department,
      },
    };
  }
}