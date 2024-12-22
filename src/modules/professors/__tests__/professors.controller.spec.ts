import { UnauthorizedException, BadRequestException, ConflictException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { getModelToken } from "@nestjs/mongoose";
import { TestingModule, Test } from "@nestjs/testing";
import { TEST_ADMIN_PASSWORD } from "@test/utils/test-utils";
import { Model, Types } from "mongoose";
import { ProfessorsService } from "../professors.service";
import { Professor } from "../schemas/professors.schema";

describe('ProfessorsService', () => {
  let service: ProfessorsService;
  let model: Model<Professor>;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfessorsService,
        {
          provide: getModelToken(Professor.name),
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue(TEST_ADMIN_PASSWORD),
          },
        },
      ],
    }).compile();

    service = module.get<ProfessorsService>(ProfessorsService);
    model = module.get<Model<Professor>>(getModelToken(Professor.name));
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('create', () => {
    const validCreateProfessorDto = {
      username: 'testprof',
      password: 'Password123!',
      adminPassword: TEST_ADMIN_PASSWORD,
      name: {
        firstName: 'Test',
        lastName: 'Professor'
      },
      email: 'test@miami.edu',
      department: 'Computer Science',
      title: 'Associate Professor',
      researchAreas: ['AI', 'Machine Learning'],
      office: 'Room 123',
      phoneNumber: '305-123-4567',
      bio: 'Test bio'
    };

    it('should successfully create a professor with valid data', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValue(null);
      jest.spyOn(model, 'create').mockImplementation((dto: any) => {
        const data = Array.isArray(dto) ? dto[0] : dto;
        
        const professor = {
          ...data,
          _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
          createdAt: new Date(),
          updatedAt: new Date(),
          isActive: true,
          toObject: function() {
            const obj = { ...this };
            delete obj.toObject; // Remove the function from the object representation
            return obj;
          }
        };
        return Promise.resolve([professor]) as any;
      });

      const result = await service.create(validCreateProfessorDto);

      expect(result).toBeDefined();
      expect(result.username).toBe(validCreateProfessorDto.username);
      expect(result.email).toBe(validCreateProfessorDto.email);
      expect(result.department).toBe(validCreateProfessorDto.department);
      expect(result).not.toHaveProperty('password');
      expect(result).not.toHaveProperty('adminPassword');
      expect(result.isActive).toBe(true);
    });

    it('should throw UnauthorizedException with invalid admin password', async () => {
      const invalidDto = {
        ...validCreateProfessorDto,
        adminPassword: 'wrong-password',
      };

      await expect(service.create(invalidDto)).rejects.toThrow(UnauthorizedException);
      await expect(service.create(invalidDto)).rejects.toThrow('Invalid admin password');
    });

    it('should throw BadRequestException with invalid email domain', async () => {
      const invalidDto = {
        ...validCreateProfessorDto,
        email: 'test@gmail.com',
      };

      await expect(service.create(invalidDto)).rejects.toThrow(BadRequestException);
      await expect(service.create(invalidDto)).rejects.toThrow('Email must be a valid miami.edu address');
    });

    it('should throw ConflictException when username already exists', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValue({ username: 'testprof' } as Professor);

      await expect(service.create(validCreateProfessorDto)).rejects.toThrow(ConflictException);
      await expect(service.create(validCreateProfessorDto)).rejects.toThrow('Username already exists');
    });

    it('should throw ConflictException when email already exists', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValue({ email: 'test@miami.edu' } as Professor);

      await expect(service.create(validCreateProfessorDto)).rejects.toThrow(ConflictException);
      await expect(service.create(validCreateProfessorDto)).rejects.toThrow('Email already exists');
    });

    it('should throw BadRequestException with weak password', async () => {
      const weakPasswordDto = {
        ...validCreateProfessorDto,
        password: 'weak',
      };

      await expect(service.create(weakPasswordDto)).rejects.toThrow(BadRequestException);
      await expect(service.create(weakPasswordDto)).rejects.toThrow('Password must be at least 8 characters long');
    });

    it('should throw BadRequestException when password lacks required characters', async () => {
      const invalidPasswords = {
        noUpperCase: 'password123!',
        noLowerCase: 'PASSWORD123!',
        noNumbers: 'Password!!',
        noSpecialChars: 'Password123',
      };

      for (const [key, password] of Object.entries(invalidPasswords)) {
        const dto = {
          ...validCreateProfessorDto,
          password,
        };

        await expect(service.create(dto)).rejects.toThrow(BadRequestException);
        await expect(service.create(dto)).rejects.toThrow(
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        );
      }
    });
  });
});