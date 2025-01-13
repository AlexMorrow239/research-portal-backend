import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { Response } from 'express';

import {
  AcademicStanding,
  ApplicationStatus,
  Citizenship,
  College,
  ProjectLength,
  WeeklyAvailability,
} from '@common/enums/';

import { ApplicationsController } from '../applications.controller';
import { ApplicationsService } from '../applications.service';

describe('ApplicationsController', () => {
  let controller: ApplicationsController;
  let service: ApplicationsService;

  const mockProfessor = {
    id: 'prof1',
    email: 'prof@miami.edu',
    name: { firstName: 'Prof', lastName: 'Test' },
  };

  const mockApplicationData = JSON.stringify({
    studentInfo: {
      name: { firstName: 'John', lastName: 'Doe' },
      email: 'john.doe@miami.edu',
      cNumber: 'C12345678',
      phoneNumber: '123-456-7890',
      racialEthnicGroups: ['GROUP1'],
      citizenship: 'US_CITIZEN',
      academicStanding: 'JUNIOR',
      graduationDate: new Date().toISOString(),
      major1College: 'ARTS_SCIENCES',
      major1: 'Computer Science',
      hasAdditionalMajor: false,
      isPreHealth: false,
      gpa: 3.5,
    },
    availability: {
      mondayAvailability: '9AM-5PM',
      tuesdayAvailability: '9AM-5PM',
      wednesdayAvailability: '9AM-5PM',
      thursdayAvailability: '9AM-5PM',
      fridayAvailability: '9AM-5PM',
      weeklyHours: 'TWENTY',
      desiredProjectLength: 'ONE_SEMESTER',
    },
    additionalInfo: {
      hasFederalWorkStudy: false,
      speaksOtherLanguages: false,
      comfortableWithAnimals: true,
    },
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApplicationsController],
      providers: [
        {
          provide: ApplicationsService,
          useValue: {
            create: jest.fn(),
            findProjectApplications: jest.fn(),
            updateStatus: jest.fn(),
            getResume: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ApplicationsController>(ApplicationsController);
    service = module.get<ApplicationsService>(ApplicationsService);
  });

  describe('create', () => {
    const mockApplicationData = {
      application: {
        studentInfo: {
          name: { firstName: 'John', lastName: 'Doe' },
          email: 'john.doe@miami.edu',
          cNumber: 'C12345678',
          phoneNumber: '123-456-7890',
          racialEthnicGroups: ['GROUP1'],
          citizenship: Citizenship.US_CITIZEN,
          academicStanding: AcademicStanding.FRESHMAN,
          graduationDate: new Date(),
          major1College: College.ARTS_AND_SCIENCES,
          major1: 'Computer Science',
          hasAdditionalMajor: false,
          isPreHealth: false,
          gpa: 3.5,
        },
        availability: {
          mondayAvailability: '9AM-5PM',
          tuesdayAvailability: '9AM-5PM',
          wednesdayAvailability: '9AM-5PM',
          thursdayAvailability: '9AM-5PM',
          fridayAvailability: '9AM-5PM',
          weeklyHours: WeeklyAvailability.NINE_TO_ELEVEN,
          desiredProjectLength: ProjectLength.FOUR_PLUS,
        },
        additionalInfo: {
          hasFederalWorkStudy: false,
          speaksOtherLanguages: false,
          comfortableWithAnimals: true,
          hasPrevResearchExperience: false,
          researchInterestDescription: 'Test research interest',
        },
        coverLetter: 'Test cover letter',
        references: ['Dr. Smith', 'Dr. Johnson'],
      },
    };

    const mockFile = {
      buffer: Buffer.from('test'),
      originalname: 'resume.pdf',
      mimetype: 'application/pdf',
      size: 1024,
    } as Express.Multer.File;

    it('should create application successfully', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(mockApplicationData as any);

      const result = await controller.create('project1', mockApplicationData, mockFile);

      expect(result).toBeDefined();
      expect(service.create).toHaveBeenCalledWith(
        'project1',
        mockApplicationData.application,
        mockFile,
      );
    });
    it('should handle invalid application data', async () => {
      const invalidData = { application: 'invalid-json' };
      jest.spyOn(service, 'create').mockRejectedValue(new BadRequestException());

      await expect(controller.create('project1', invalidData as any, mockFile)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
  describe('findAll', () => {
    it('should return all applications for a project', async () => {
      const mockApplications = [mockApplicationData];
      jest.spyOn(service, 'findProjectApplications').mockResolvedValue(mockApplications as any);

      const result = await controller.findAll(
        'project1',
        mockProfessor as any,
        ApplicationStatus.PENDING,
      );

      expect(result).toBe(mockApplications);
      expect(service.findProjectApplications).toHaveBeenCalledWith(
        mockProfessor.id,
        'project1',
        ApplicationStatus.PENDING,
      );
    });

    it('should handle project not found', async () => {
      jest.spyOn(service, 'findProjectApplications').mockRejectedValue(new NotFoundException());

      await expect(controller.findAll('invalid-project', mockProfessor as any)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('downloadResume', () => {
    it('should download resume successfully', async () => {
      const mockFileData = {
        file: Buffer.from('test'),
        fileName: 'resume.pdf',
        mimeType: 'application/pdf',
      };

      jest.spyOn(service, 'getResume').mockResolvedValue(mockFileData);

      const mockResponse = {
        setHeader: jest.fn(),
        send: jest.fn(),
      } as unknown as Response;

      await controller.downloadResume('project1', 'app1', mockProfessor as any, mockResponse);

      expect(service.getResume).toHaveBeenCalledWith(mockProfessor.id, 'app1');
      expect(mockResponse.setHeader).toHaveBeenCalledWith('Content-Type', mockFileData.mimeType);
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Content-Disposition',
        `attachment; filename="${mockFileData.fileName}"`,
      );
      expect(mockResponse.send).toHaveBeenCalledWith(mockFileData.file);
    });

    it('should handle resume not found', async () => {
      jest.spyOn(service, 'getResume').mockRejectedValue(new NotFoundException());

      const mockResponse = {
        setHeader: jest.fn(),
        send: jest.fn(),
      } as unknown as Response;

      await expect(
        controller.downloadResume('project1', 'invalid-app', mockProfessor as any, mockResponse),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
