import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { ApplicationsController } from '../applications.controller';
import { ApplicationsService } from '../applications.service';
import { ApplicationStatus } from '@/common/enums';

describe('ApplicationsController', () => {
  let controller: ApplicationsController;
  let service: ApplicationsService;

  const mockProfessor = {
    id: 'prof1',
    email: 'prof@miami.edu',
    name: { firstName: 'Prof', lastName: 'Test' },
  };

  const mockApplication = {
    id: 'app1',
    project: 'project1',
    studentInfo: {
      name: { firstName: 'John', lastName: 'Doe' },
      email: 'john.doe@miami.edu',
    },
    status: ApplicationStatus.PENDING,
  };

  const mockFile = {
    buffer: Buffer.from('test'),
    originalname: 'resume.pdf',
  } as Express.Multer.File;

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
    const mockApplicationData = JSON.stringify({
      studentInfo: {
        name: { firstName: 'John', lastName: 'Doe' },
        email: 'john.doe@miami.edu',
      },
    });

    it('should create application successfully', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(mockApplication as any);

      const result = await controller.create('project1', mockApplicationData, mockFile);

      expect(result).toBe(mockApplication);
      expect(service.create).toHaveBeenCalledWith(
        'project1',
        JSON.parse(mockApplicationData),
        mockFile,
      );
    });

    it('should handle invalid JSON data', async () => {
      await expect(controller.create('project1', 'invalid-json', mockFile)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all applications for a project', async () => {
      const mockApplications = [mockApplication];
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

  describe('updateStatus', () => {
    it('should update application status successfully', async () => {
      jest.spyOn(service, 'updateStatus').mockResolvedValue(mockApplication as any);

      const result = await controller.updateStatus('app1', mockProfessor as any, {
        status: ApplicationStatus.ACCEPTED,
      });

      expect(result).toBe(mockApplication);
      expect(service.updateStatus).toHaveBeenCalledWith(
        mockProfessor.id,
        'app1',
        ApplicationStatus.ACCEPTED,
      );
    });

    it('should handle application not found', async () => {
      jest.spyOn(service, 'updateStatus').mockRejectedValue(new NotFoundException());

      await expect(
        controller.updateStatus('invalid-app', mockProfessor as any, {
          status: ApplicationStatus.ACCEPTED,
        }),
      ).rejects.toThrow(NotFoundException);
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
