import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { createTestProfessor } from '@test/utils/test-utils';

import { FileStorageService } from '../../file-storage/file-storage.service';
import { ProjectsService } from '../projects.service';
import { Project, ProjectStatus } from '../schemas/projects.schema';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let projectModel: any;
  let fileStorageService: FileStorageService;

  const mockProject = {
    _id: 'test-project-id',
    title: 'Test Project',
    description: 'Test Description',
    department: 'Computer Science',
    requirements: ['Requirement 1'],
    positions: 2,
    status: ProjectStatus.DRAFT,
    professor: 'test-professor-id',
    isVisible: false,
    toObject: () => ({
      _id: 'test-project-id',
      title: 'Test Project',
      description: 'Test Description',
      department: 'Computer Science',
      requirements: ['Requirement 1'],
      positions: 2,
      status: ProjectStatus.DRAFT,
      professor: 'test-professor-id',
      isVisible: false,
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: getModelToken(Project.name),
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            findById: jest.fn(),
            findOne: jest.fn(),
            findOneAndUpdate: jest.fn(),
            findOneAndDelete: jest.fn(),
            countDocuments: jest.fn(),
          },
        },
        {
          provide: FileStorageService,
          useValue: {
            saveFile: jest.fn(),
            deleteFile: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
    projectModel = module.get(getModelToken(Project.name));
    fileStorageService = module.get<FileStorageService>(FileStorageService);
  });

  describe('create', () => {
    const createProjectDto = {
      title: 'Test Project',
      description: 'Test Description',
      department: 'Computer Science',
      requirements: ['Requirement 1'],
      positions: 2,
      status: ProjectStatus.DRAFT,
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      applicationDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    };

    it('should create a project successfully', async () => {
      const professor = await createTestProfessor();
      jest.spyOn(projectModel, 'create').mockResolvedValue(mockProject);

      const result = await service.create(professor, createProjectDto);

      expect(result).toBeDefined();
      expect(result.title).toBe(mockProject.title);
      expect(result.professor.id).toBe(professor.id);
    });

    it('should throw BadRequestException when start date is in the past', async () => {
      const professor = await createTestProfessor();
      const invalidDto = {
        ...createProjectDto,
        startDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
      };

      await expect(service.create(professor, invalidDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when end date is before start date', async () => {
      const professor = await createTestProfessor();
      const invalidDto = {
        ...createProjectDto,
        endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      };

      await expect(service.create(professor, invalidDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return paginated projects with total count', async () => {
        const mockProjects = [mockProject, mockProject];
      
        const mockQuery = {
          populate: jest.fn().mockReturnThis(),
          skip: jest.fn().mockReturnThis(),
          limit: jest.fn().mockReturnThis(),
          sort: jest.fn().mockReturnThis(),
          exec: jest.fn().mockResolvedValue(mockProjects),
        };
      
        jest.spyOn(projectModel, 'find').mockReturnValue(mockQuery);
        jest.spyOn(projectModel, 'countDocuments').mockResolvedValue(2);
      
        const result = await service.findAll({});
      
        expect(result.projects).toHaveLength(2);
        expect(result.total).toBe(2);
      });

      it('should apply filters correctly', async () => {
        const filters = {
          department: 'Computer Science',
          status: ProjectStatus.PUBLISHED,
          search: 'test',
          tags: ['AI'],
        };
      
        const mockQuery = {
          populate: jest.fn().mockReturnThis(),
          skip: jest.fn().mockReturnThis(),
          limit: jest.fn().mockReturnThis(),
          sort: jest.fn().mockReturnThis(),
          exec: jest.fn().mockResolvedValue([mockProject]),
        };
      
        jest.spyOn(projectModel, 'find').mockReturnValue(mockQuery);
        jest.spyOn(projectModel, 'countDocuments').mockResolvedValue(1);
      
        await service.findAll(filters);
      
        expect(projectModel.find).toHaveBeenCalled();
      });
  });

describe('findOne', () => {
    it('should return a project by id', async () => {
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockProject),
      };
      jest.spyOn(projectModel, 'findById').mockReturnValue(mockQuery);
  
      const result = await service.findOne('test-project-id');
  
      expect(result).toBeDefined();
      expect(result.id).toBe(mockProject._id);
    });
  
    it('should throw NotFoundException when project not found', async () => {
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      };
      jest.spyOn(projectModel, 'findById').mockReturnValue(mockQuery);
  
      await expect(service.findOne('nonexistent-id')).rejects.toThrow(NotFoundException);
    });
  });
  
  describe('addProjectFile', () => {
    const mockFile = {
      originalname: 'test.pdf',
      mimetype: 'application/pdf',
      size: 1024,
    } as Express.Multer.File;
  
    beforeEach(() => {
      projectModel.findOne = jest.fn();
      projectModel.findByIdAndUpdate = jest.fn();
    });
  
    it('should add a file to the project', async () => {
      jest.spyOn(projectModel, 'findOne').mockResolvedValue(mockProject);
      jest.spyOn(fileStorageService, 'saveFile').mockResolvedValue('saved-file-name');
      jest.spyOn(projectModel, 'findByIdAndUpdate').mockResolvedValue(mockProject);
  
      const result = await service.addProjectFile('professor-id', 'project-id', mockFile);
  
      expect(result).toBeDefined();
      expect(result.fileName).toBe('saved-file-name');
      expect(result.originalName).toBe(mockFile.originalname);
    });
  });
});