import { Test, TestingModule } from '@nestjs/testing';
import { ProfessorsService } from '../professors.service';
import { getModelToken } from '@nestjs/mongoose';
import { Professor } from '../schemas/professors.schema';
import { ConfigService } from '@nestjs/config';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { createTestProfessor } from '@test/utils/test-utils';
import { InvalidEmailDomainException } from '../exceptions/invalid-email-domain.exception';
import { InvalidPasswordFormatException } from '../exceptions/invalid-password-format.exception';
import { InvalidAdminPasswordException } from '../exceptions/password.exception';

describe('ProfessorsService', () => {
  let service: ProfessorsService;
  let professorModel: any;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'ADMIN_PASSWORD') return 'admin123';
      return null;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfessorsService,
        {
          provide: getModelToken(Professor.name),
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<ProfessorsService>(ProfessorsService);
    professorModel = module.get(getModelToken(Professor.name));
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('create', () => {
    const createProfessorDto = {
      email: 'test@miami.edu',
      password: 'Test123!@#',
      adminPassword: 'admin123',
      name: {
        firstName: 'Test',
        lastName: 'Professor',
      },
      department: 'Computer Science',
      title: 'Associate Professor',
      researchAreas: ['AI', 'Machine Learning'],
      office: 'Room 123',
      phoneNumber: '305-123-4567',
      bio: 'Test bio',
    };

    it('should create a professor successfully', async () => {
        const professor = await createTestProfessor();
        const mockNewProfessor = {
          _id: professor._id,
          email: professor.email,
          name: professor.name,
          department: professor.department,
          title: professor.title,
          isActive: true,
          toObject: () => ({
            _id: professor._id,
            email: professor.email,
            name: professor.name,
            department: professor.department,
            title: professor.title,
            isActive: true
          })
        };
    
        jest.spyOn(professorModel, 'findOne').mockResolvedValue(null);
        jest.spyOn(professorModel, 'create').mockResolvedValue(mockNewProfessor);
    
        const result = await service.create(createProfessorDto);
    
        expect(result).toBeDefined();
        expect(result.email).toBe(professor.email);
        expect(result).not.toHaveProperty('password');
        expect(result).not.toHaveProperty('adminPassword');
      });

    it('should throw InvalidAdminPasswordException when admin password is incorrect', async () => {
      const invalidDto = { ...createProfessorDto, adminPassword: 'wrong' };

      await expect(service.create(invalidDto)).rejects.toThrow(InvalidAdminPasswordException);
    });

    it('should throw InvalidEmailDomainException for non-miami.edu email', async () => {
      const invalidDto = { ...createProfessorDto, email: 'test@gmail.com' };

      await expect(service.create(invalidDto)).rejects.toThrow(InvalidEmailDomainException);
    });

    it('should throw ConflictException when email already exists', async () => {
      jest.spyOn(professorModel, 'findOne').mockResolvedValue({ email: createProfessorDto.email });

      await expect(service.create(createProfessorDto)).rejects.toThrow(ConflictException);
    });

    it('should throw InvalidPasswordFormatException for weak password', async () => {
      const invalidDto = { ...createProfessorDto, password: 'weak' };

      await expect(service.create(invalidDto)).rejects.toThrow(InvalidPasswordFormatException);
    });
  });

  describe('updateProfile', () => {
    const updateProfileDto = {
      title: 'Full Professor',
      researchAreas: ['AI', 'Machine Learning', 'Data Science'],
      office: 'Room 456',
      phoneNumber: '305-987-6543',
      bio: 'Updated bio',
    };

    it('should update professor profile successfully', async () => {
      const professor = await createTestProfessor();
      const updatedProfessor = { 
        ...professor,
        ...updateProfileDto,
        toObject: () => ({
          ...professor,
          ...updateProfileDto,
          _id: professor._id
        })
      };
      
      jest.spyOn(professorModel, 'findById').mockResolvedValue(professor);
      jest.spyOn(professorModel, 'findByIdAndUpdate').mockResolvedValue(updatedProfessor);

      const result = await service.updateProfile(professor._id, updateProfileDto);

      expect(result).toBeDefined();
      expect(result.title).toBe(updateProfileDto.title);
      expect(result).not.toHaveProperty('password');
    });

    it('should throw NotFoundException when professor not found', async () => {
      jest.spyOn(professorModel, 'findById').mockResolvedValue(null);

      await expect(
        service.updateProfile('nonexistent-id', updateProfileDto)
      ).rejects.toThrow('Professor not found');
    });
  });
});