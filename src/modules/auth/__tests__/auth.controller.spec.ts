import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { createTestProfessor } from '../../../../test/utils/test-utils';
import { LoginDto } from '../../../common/dto/auth/login.dto';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should return access token when credentials are valid', async () => {
      const professor = await createTestProfessor();
      const loginDto: LoginDto = {
        email: professor.email,
        password: 'testPassword123',
      };

      const loginResponse = {
        accessToken: 'test-token',
        professor: {
          id: professor._id,
          email: professor.email,
          name: professor.name,
          department: professor.department,
          title: professor.title,
        },
      };

      jest.spyOn(authService, 'login').mockResolvedValue(loginResponse);

      const result = await controller.login(loginDto);

      expect(result).toEqual(loginResponse);
      expect(authService.login).toHaveBeenCalledWith(loginDto.email, loginDto.password);
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      const loginDto: LoginDto = {
        email: 'wrong@miami.edu',
        password: 'wrongpass',
      };

      jest
        .spyOn(authService, 'login')
        .mockRejectedValue(new UnauthorizedException('Invalid credentials'));

      await expect(controller.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should not expose sensitive information in response', async () => {
      const professor = await createTestProfessor();
      const loginDto: LoginDto = {
        email: professor.email,
        password: 'testPassword123',
      };

      const loginResponse = {
        accessToken: 'test-token',
        professor: {
          id: professor._id,
          email: professor.email,
          name: professor.name,
          department: professor.department,
          title: professor.title,
        },
      };

      jest.spyOn(authService, 'login').mockResolvedValue(loginResponse);

      const result = await controller.login(loginDto);

      expect(result.professor).not.toHaveProperty('password');
      expect(result.professor).toHaveProperty('id');
      expect(result.professor).toHaveProperty('email');
      expect(result.professor).toHaveProperty('name');
      expect(result.professor).toHaveProperty('department');
    });
  });
});
