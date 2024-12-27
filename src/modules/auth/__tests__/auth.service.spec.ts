import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';

import { Professor } from '../../professors/schemas/professors.schema';
import { AuthService } from '../auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let professorModel: any;

  const mockProfessor = {
    _id: 'test-id',
    email: 'test@miami.edu',
    password: 'hashedPassword123',
    name: {
      firstName: 'Test',
      lastName: 'Professor',
    },
    department: 'Computer Science',
    isActive: true,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('test-token'),
          },
        },
        {
          provide: getModelToken(Professor.name),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    professorModel = module.get(getModelToken(Professor.name));
  });

  describe('login', () => {
    it('should return access token when credentials are valid', async () => {
      const loginDto = {
        email: 'test@miami.edu',
        password: 'correctPassword',
      };

      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));
      jest.spyOn(professorModel, 'findOne').mockResolvedValue(mockProfessor);

      const result = await service.login(loginDto.email, loginDto.password);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('professor');
      expect(result.professor).not.toHaveProperty('password');
      expect(jwtService.sign).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when professor is not found', async () => {
      jest.spyOn(professorModel, 'findOne').mockResolvedValue(null);

      await expect(service.login('nonexistent@miami.edu', 'password')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when password is incorrect', async () => {
      jest.spyOn(professorModel, 'findOne').mockResolvedValue(mockProfessor);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false));

      await expect(service.login('test@miami.edu', 'wrongpassword')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when professor account is inactive', async () => {
      const inactiveProfessor = { ...mockProfessor, isActive: false };
      jest.spyOn(professorModel, 'findOne').mockResolvedValue(inactiveProfessor);

      await expect(service.login('test@miami.edu', 'password')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
