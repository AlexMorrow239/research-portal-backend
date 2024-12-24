import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { createTestProfessor } from '@test/utils/test-utils';
import { UnauthorizedException } from '@nestjs/common';

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
      const loginResponse = {
        accessToken: 'test-token',
        professor: {
          id: professor._id,
          username: professor.username,
          name: professor.name,
          email: professor.email,
          department: professor.department,
        },
      };

      jest.spyOn(authService, 'login').mockResolvedValue(loginResponse);

      const result = await controller.login({
        username: 'testprof',
        password: 'testPassword123',
      });

      expect(result).toEqual(loginResponse);
      expect(authService.login).toHaveBeenCalledWith('testprof', 'testPassword123');
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      jest.spyOn(authService, 'login')
        .mockRejectedValue(new UnauthorizedException('Invalid credentials'));

      await expect(
        controller.login({
          username: 'wronguser',
          password: 'wrongpass',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should not expose sensitive information in response', async () => {
      const professor = await createTestProfessor();
      const loginResponse = {
        accessToken: 'test-token',
        professor: {
          id: professor._id,
          username: professor.username,
          name: professor.name,
          email: professor.email,
          department: professor.department,
        },
      };

      jest.spyOn(authService, 'login').mockResolvedValue(loginResponse);

      const result = await controller.login({
        username: 'testprof',
        password: 'testPassword123',
      });

      expect(result.professor).not.toHaveProperty('password');
      expect(result.professor).toHaveProperty('id');
      expect(result.professor).toHaveProperty('username');
      expect(result.professor).toHaveProperty('name');
      expect(result.professor).toHaveProperty('email');
      expect(result.professor).toHaveProperty('department');
    });
  });
});