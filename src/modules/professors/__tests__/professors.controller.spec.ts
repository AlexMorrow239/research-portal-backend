import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { createTestProfessor } from '../../../../test/utils/test-utils';
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
            getProfile: jest.fn(),
            changePassword: jest.fn(),
            deactivateAccount: jest.fn(),
            reactivateAccount: jest.fn(),
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
        office: 'Room 123',
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
        office: 'Room 123',
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

  describe('getProfile', () => {
    it('should get professor profile successfully', async () => {
      const professor = await createTestProfessor();
      const expectedResponse = {
        id: professor._id,
        email: professor.email,
        name: professor.name,
        department: professor.department,
        isActive: true,
        office: 'Room 123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(professorsService, 'getProfile').mockResolvedValue(expectedResponse);

      const result = await controller.getProfile({ ...professor, id: professor._id } as any);

      expect(result).toEqual(expectedResponse);
      expect(professorsService.getProfile).toHaveBeenCalledWith(professor._id);
    });

    it('should throw NotFoundException when professor not found', async () => {
      const professor = await createTestProfessor();
      jest
        .spyOn(professorsService, 'getProfile')
        .mockRejectedValue(new NotFoundException('Professor not found'));

      await expect(
        controller.getProfile({ ...professor, id: professor._id } as any),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('changePassword', () => {
    const changePasswordDto = {
      currentPassword: 'OldPass123!',
      newPassword: 'NewPass456!',
    };

    it('should change password successfully', async () => {
      const professor = await createTestProfessor();
      jest.spyOn(professorsService, 'changePassword').mockResolvedValue(undefined);

      await controller.changePassword(
        { ...professor, id: professor._id } as any,
        changePasswordDto,
      );

      expect(professorsService.changePassword).toHaveBeenCalledWith(
        professor._id,
        changePasswordDto.currentPassword,
        changePasswordDto.newPassword,
      );
    });

    it('should throw UnauthorizedException when current password is incorrect', async () => {
      const professor = await createTestProfessor();
      jest
        .spyOn(professorsService, 'changePassword')
        .mockRejectedValue(new UnauthorizedException('Current password is incorrect'));

      await expect(
        controller.changePassword({ ...professor, id: professor._id } as any, changePasswordDto),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('deactivateAccount', () => {
    it('should deactivate account successfully', async () => {
      const professor = await createTestProfessor();
      jest.spyOn(professorsService, 'deactivateAccount').mockResolvedValue(undefined);

      await controller.deactivateAccount({ ...professor, id: professor._id } as any);

      expect(professorsService.deactivateAccount).toHaveBeenCalledWith(professor._id);
    });

    it('should throw NotFoundException when professor not found', async () => {
      const professor = await createTestProfessor();
      jest
        .spyOn(professorsService, 'deactivateAccount')
        .mockRejectedValue(new NotFoundException('Professor not found'));

      await expect(
        controller.deactivateAccount({ ...professor, id: professor._id } as any),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('reactivateAccount', () => {
    const reactivateDto = {
      email: 'test@miami.edu',
      password: 'Test123!@#',
      adminPassword: 'admin123',
    };

    it('should reactivate account successfully', async () => {
      jest.spyOn(professorsService, 'reactivateAccount').mockResolvedValue(undefined);

      await controller.reactivateAccount(reactivateDto);

      expect(professorsService.reactivateAccount).toHaveBeenCalledWith(reactivateDto);
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      jest
        .spyOn(professorsService, 'reactivateAccount')
        .mockRejectedValue(new UnauthorizedException('Invalid credentials'));

      await expect(controller.reactivateAccount(reactivateDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw BadRequestException when account is already active', async () => {
      jest
        .spyOn(professorsService, 'reactivateAccount')
        .mockRejectedValue(new BadRequestException('Account is already active'));

      await expect(controller.reactivateAccount(reactivateDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
