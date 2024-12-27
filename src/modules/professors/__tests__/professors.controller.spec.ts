import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { createTestProfessor } from '@test/utils/test-utils';

import { InvalidEmailDomainException } from '../exceptions/invalid-email-domain.exception';
import { ProfessorsController } from '../professors.controller';
import { ProfessorsService } from '../professors.service';

describe('ProfessorsController', () => {
  let controller: ProfessorsController;
  let professorsService: ProfessorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfessorsController],
      providers: [
        {
          provide: ProfessorsService,
          useValue: {
            create: jest.fn(),
            updateProfile: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProfessorsController>(ProfessorsController);
    professorsService = module.get<ProfessorsService>(ProfessorsService);
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
      const expectedResponse = {
        id: professor._id,
        email: professor.email,
        name: professor.name,
        department: professor.department,
        title: 'Associate Professor',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(professorsService, 'create').mockResolvedValue(expectedResponse);

      const result = await controller.create(createProfessorDto);

      expect(result).toEqual(expectedResponse);
      expect(professorsService.create).toHaveBeenCalledWith(createProfessorDto);
    });

    it('should throw InvalidEmailDomainException for invalid email domain', async () => {
      jest.spyOn(professorsService, 'create').mockRejectedValue(new InvalidEmailDomainException());

      await expect(
        controller.create({
          ...createProfessorDto,
          email: 'test@gmail.com',
        }),
      ).rejects.toThrow(InvalidEmailDomainException);
    });

    it('should throw ConflictException for duplicate email', async () => {
      jest
        .spyOn(professorsService, 'create')
        .mockRejectedValue(new ConflictException('Email already exists'));

      await expect(controller.create(createProfessorDto)).rejects.toThrow(ConflictException);
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
      const expectedResponse = {
        id: professor._id,
        email: professor.email,
        name: professor.name,
        department: professor.department,
        title: 'Associate Professor',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(professorsService, 'updateProfile').mockResolvedValue(expectedResponse);

      const result = await controller.updateProfile(
        { ...professor, id: professor._id } as any,
        updateProfileDto,
      );

      expect(result).toEqual(expectedResponse);
      expect(professorsService.updateProfile).toHaveBeenCalledWith(professor._id, updateProfileDto);
    });

    it('should throw NotFoundException when professor not found', async () => {
      const professor = await createTestProfessor();
      jest
        .spyOn(professorsService, 'updateProfile')
        .mockRejectedValue(new NotFoundException('Professor not found'));

      await expect(
        controller.updateProfile({ ...professor, id: professor._id } as any, updateProfileDto),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
