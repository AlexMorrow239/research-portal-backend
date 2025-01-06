import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';

import { ApplicationStatus } from '@common/enums';

import { EmailService } from '../../email/email.service';
import { FileStorageService } from '../../file-storage/file-storage.service';
import { ProjectsService } from '../../projects/projects.service';
import { ProjectStatus } from '../../projects/schemas/projects.schema';
import { ApplicationsService } from '../applications.service';
import { Application } from '../schemas/applications.schema';

describe('ApplicationsService', () => {
  let service: ApplicationsService;
  let applicationModel: Model<Application>;
  let projectsService: ProjectsService;
  let fileStorageService: FileStorageService;
  let emailService: EmailService;

  const mockApplication = {
    id: 'app1',
    project: 'project1',
    studentInfo: {
      name: { firstName: 'John', lastName: 'Doe' },
      email: 'john.doe@miami.edu',
      cNumber: 'C12345678',
      phoneNumber: '123-456-7890',
      racialEthnicGroups: ['GROUP1'],
      citizenship: 'US_CITIZEN',
      academicStanding: 'JUNIOR',
      graduationDate: new Date(),
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
    resumeFile: 'resume.pdf',
    status: ApplicationStatus.PENDING,
  };

  const mockProject = {
    id: 'project1',
    title: 'Test Project',
    status: ProjectStatus.PUBLISHED,
    professor: {
      id: 'prof1',
      email: 'prof@miami.edu',
      name: { firstName: 'Prof', lastName: 'Test' },
    },
  };

  const mockFile = {
    buffer: Buffer.from('test'),
    originalname: 'resume.pdf',
    mimetype: 'application/pdf',
    size: 1024,
  } as Express.Multer.File;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationsService,
        {
          provide: getModelToken(Application.name),
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            populate: jest.fn(),
          },
        },
        {
          provide: ProjectsService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: FileStorageService,
          useValue: {
            saveFile: jest.fn(),
            getFile: jest.fn().mockResolvedValue({
              buffer: Buffer.from('test file content'),
              mimeType: 'application/pdf',
            }),
            deleteFile: jest.fn(),
          },
        },
        {
          provide: EmailService,
          useValue: {
            sendApplicationConfirmation: jest.fn(),
            sendProfessorNewApplication: jest.fn(),
            sendApplicationStatusUpdate: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ApplicationsService>(ApplicationsService);
    applicationModel = module.get<Model<Application>>(getModelToken(Application.name));
    projectsService = module.get<ProjectsService>(ProjectsService);
    fileStorageService = module.get<FileStorageService>(FileStorageService);
    emailService = module.get<EmailService>(EmailService);
  });

  describe('create', () => {
    it('should create a new application successfully', async () => {
      jest.spyOn(projectsService, 'findOne').mockResolvedValue(mockProject as any);
      jest.spyOn(fileStorageService, 'saveFile').mockResolvedValue('saved-resume.pdf');
      jest.spyOn(applicationModel, 'create').mockResolvedValue(mockApplication as any);

      const result = await service.create('project1', {} as any, mockFile);

      expect(result).toBe(mockApplication);
      expect(emailService.sendApplicationConfirmation).toHaveBeenCalled();
      expect(emailService.sendProfessorNewApplication).toHaveBeenCalled();
    });

    it('should throw BadRequestException if project is not published', async () => {
      jest.spyOn(projectsService, 'findOne').mockResolvedValue({
        ...mockProject,
        status: ProjectStatus.DRAFT,
      } as any);

      await expect(service.create('project1', {} as any, mockFile)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if application deadline has passed', async () => {
      jest.spyOn(projectsService, 'findOne').mockResolvedValue({
        ...mockProject,
        applicationDeadline: '2020-01-01',
      } as any);

      await expect(service.create('project1', {} as any, mockFile)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('updateStatus', () => {
    it('should update application status successfully', async () => {
      const populatedApplication = {
        ...mockApplication,
        project: mockProject,
      };

      jest.spyOn(applicationModel, 'findById').mockReturnValue({
        populate: jest.fn().mockResolvedValue(populatedApplication),
      } as any);

      jest.spyOn(applicationModel, 'findByIdAndUpdate').mockReturnValue({
        populate: jest.fn().mockResolvedValue(populatedApplication),
      } as any);

      const result = await service.updateStatus('prof1', 'app1', ApplicationStatus.ACCEPTED);

      expect(result).toBeDefined();
      expect(emailService.sendApplicationStatusUpdate).toHaveBeenCalled();
    });

    it('should throw NotFoundException if application not found', async () => {
      jest.spyOn(applicationModel, 'findById').mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(
        service.updateStatus('prof1', 'app1', ApplicationStatus.ACCEPTED),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if professor is not project owner', async () => {
      const populatedApplication = {
        ...mockApplication,
        project: { ...mockProject, professor: { id: 'different-prof' } },
      };

      jest.spyOn(applicationModel, 'findById').mockReturnValue({
        populate: jest.fn().mockResolvedValue(populatedApplication),
      } as any);

      await expect(
        service.updateStatus('prof1', 'app1', ApplicationStatus.ACCEPTED),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getResume', () => {
    describe('getResume', () => {
      it('should return resume file successfully', async () => {
        const mockFileData = {
          buffer: Buffer.from('test file content'),
          mimeType: 'application/pdf',
        };

        // Mock the populated application with proper professor ID structure
        jest.spyOn(applicationModel, 'findById').mockReturnValue({
          populate: jest.fn().mockResolvedValue({
            ...mockApplication,
            project: {
              professor: {
                id: 'prof1',
                toString: () => 'prof1', // Add toString method to match comparison
              },
            },
            resumeFile: 'resume.pdf',
          }),
        } as any);

        jest.spyOn(fileStorageService, 'getFile').mockResolvedValue(mockFileData);

        const result = await service.getResume('prof1', 'app1');

        expect(result).toBeDefined();
        expect(result.file).toEqual(mockFileData.buffer);
        expect(result.fileName).toBe('resume.pdf');
        expect(result.mimeType).toBe('application/pdf');
      });
    });

    it('should throw NotFoundException if application not found', async () => {
      jest.spyOn(applicationModel, 'findById').mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(service.getResume('prof1', 'app1')).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if professor is not project owner', async () => {
      jest.spyOn(applicationModel, 'findById').mockReturnValue({
        populate: jest.fn().mockResolvedValue({
          ...mockApplication,
          project: { professor: { id: 'different-prof' } },
        }),
      } as any);

      await expect(service.getResume('prof1', 'app1')).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if resume file not found', async () => {
      jest.spyOn(applicationModel, 'findById').mockReturnValue({
        populate: jest.fn().mockResolvedValue({
          ...mockApplication,
          project: { professor: { id: 'prof1' } },
          resumeFile: 'resume.pdf',
        }),
      } as any);

      jest.spyOn(fileStorageService, 'getFile').mockRejectedValue(new Error('File not found'));

      await expect(service.getResume('prof1', 'app1')).rejects.toThrow(NotFoundException);
    });
  });
});
