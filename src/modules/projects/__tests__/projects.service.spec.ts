import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { createTestProfessor } from '../../../../test/utils/test-utils';
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
    researchCategories: ['Category1'],
    requirements: ['Requirement 1'],
    positions: 2,
    status: ProjectStatus.DRAFT,
    professor: {
      _id: 'test-professor-id',
      name: {
        firstName: 'John',
        lastName: 'Doe',
      },
      department: 'Computer Science',
      email: 'john.doe@test.com',
    },
    isVisible: false,
    files: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    toObject: () => ({
      _id: 'test-project-id',
      title: 'Test Project',
      description: 'Test Description',
      researchCategories: ['Category1'],
      requirements: ['Requirement 1'],
      positions: 2,
      status: ProjectStatus.DRAFT,
      professor: {
        _id: 'test-professor-id',
        name: {
          firstName: 'John',
          lastName: 'Doe',
        },
        department: 'Computer Science',
        email: 'john.doe@test.com',
      },
      isVisible: false,
      files: [],
      createdAt: new Date(),
      updatedAt: new Date(),
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
            findByIdAndUpdate: jest.fn(),
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
      researchCategories: ['Category1'],
      requirements: ['Requirement 1'],
      positions: 2,
      status: ProjectStatus.DRAFT,
      applicationDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    };

    it('should create a project successfully', async () => {
      const professor = await createTestProfessor();
      const createdProject = {
        ...mockProject,
        professor: professor.id,
      };

      jest.spyOn(projectModel, 'create').mockResolvedValue(createdProject);

      const result = await service.create(professor, createProjectDto);

      expect(result).toBeDefined();
      expect(result.title).toBe(createProjectDto.title);
      expect(result.professor.id).toBe(professor.id);
    });

    it('should throw BadRequestException when application deadline is in the past', async () => {
      const professor = await createTestProfessor();
      const invalidDto = {
        ...createProjectDto,
        applicationDeadline: new Date(Date.now() - 24 * 60 * 60 * 1000),
      };

      await expect(service.create(professor, invalidDto)).rejects.toThrow(
        new BadRequestException('Application deadline must be in the future'),
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated projects with total count', async () => {
      const mockProjects = [mockProject];
      const mockPopulatedQuery = {
        populate: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockProjects),
      };

      jest.spyOn(projectModel, 'find').mockReturnValue(mockPopulatedQuery);
      jest.spyOn(projectModel, 'countDocuments').mockResolvedValue(1);

      const result = await service.findAll({});

      expect(result.projects).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.projects[0].professor.name).toBe('John Doe');
    });

    it('should apply filters correctly', async () => {
      const filters = {
        department: 'Computer Science',
        status: ProjectStatus.PUBLISHED,
        search: 'test',
        researchCategories: ['AI'],
      };

      const mockPopulatedQuery = {
        populate: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockProject]),
      };

      jest.spyOn(projectModel, 'find').mockReturnValue(mockPopulatedQuery);
      jest.spyOn(projectModel, 'countDocuments').mockResolvedValue(1);

      const result = await service.findAll(filters);

      expect(result.projects).toHaveLength(1);
      expect(projectModel.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a project by id', async () => {
      const mockPopulatedQuery = {
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockProject),
      };

      jest.spyOn(projectModel, 'findById').mockReturnValue(mockPopulatedQuery);

      const result = await service.findOne('test-project-id');

      expect(result).toBeDefined();
      expect(result.id).toBe(mockProject._id);
      expect(result.professor.name).toBe('John Doe');
    });

    it('should throw NotFoundException when project not found', async () => {
      const mockPopulatedQuery = {
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      };

      jest.spyOn(projectModel, 'findById').mockReturnValue(mockPopulatedQuery);

      await expect(service.findOne('nonexistent-id')).rejects.toThrow(
        new NotFoundException('Project not found'),
      );
    });
  });

  describe('update', () => {
    const updateProjectDto = {
      title: 'Updated Project',
      description: 'Updated Description',
    };

    it('should update a project successfully', async () => {
      const updatedProject = {
        ...mockProject,
        title: updateProjectDto.title,
        description: updateProjectDto.description,
        toObject: () => ({
          ...mockProject.toObject(),
          title: updateProjectDto.title,
          description: updateProjectDto.description,
        }),
      };

      const mockPopulatedQuery = {
        populate: jest.fn().mockReturnValue(updatedProject),
      };

      jest.spyOn(projectModel, 'findOneAndUpdate').mockReturnValue(mockPopulatedQuery);

      const result = await service.update('professor-id', 'project-id', updateProjectDto);

      expect(result).toBeDefined();
      expect(result.title).toBe(updateProjectDto.title);
      expect(result.description).toBe(updateProjectDto.description);
      expect(projectModel.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: 'project-id', professor: 'professor-id' },
        updateProjectDto,
        { new: true },
      );
    });

    it('should throw NotFoundException when project not found', async () => {
      const mockPopulatedQuery = {
        populate: jest.fn().mockReturnValue(null),
      };

      jest.spyOn(projectModel, 'findOneAndUpdate').mockReturnValue(mockPopulatedQuery);

      await expect(
        service.update('professor-id', 'nonexistent-id', updateProjectDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a project successfully', async () => {
      const mockDeleteQuery = {
        lean: jest.fn().mockResolvedValue(mockProject),
      };

      jest.spyOn(projectModel, 'findOneAndDelete').mockReturnValue(mockDeleteQuery);
      jest.spyOn(fileStorageService, 'deleteFile').mockResolvedValue(undefined);

      await service.remove('professor-id', 'project-id');

      expect(projectModel.findOneAndDelete).toHaveBeenCalledWith({
        _id: 'project-id',
        professor: 'professor-id',
      });
    });

    it('should throw NotFoundException when project not found', async () => {
      const mockDeleteQuery = {
        lean: jest.fn().mockResolvedValue(null),
      };

      jest.spyOn(projectModel, 'findOneAndDelete').mockReturnValue(mockDeleteQuery);

      await expect(service.remove('professor-id', 'nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findProfessorProjects', () => {
    it('should return professor projects', async () => {
      const mockPopulatedQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockProject]),
      };

      jest.spyOn(projectModel, 'find').mockReturnValue(mockPopulatedQuery);

      const result = await service.findProfessorProjects('professor-id');

      expect(result).toHaveLength(1);
      expect(result[0].professor.name).toBe('John Doe');
    });

    it('should filter by status when provided', async () => {
      const mockPopulatedQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockProject]),
      };

      jest.spyOn(projectModel, 'find').mockReturnValue(mockPopulatedQuery);

      await service.findProfessorProjects('professor-id', ProjectStatus.DRAFT);

      expect(projectModel.find).toHaveBeenCalledWith({
        professor: 'professor-id',
        status: ProjectStatus.DRAFT,
      });
    });
  });

  describe('addProjectFile', () => {
    const mockFile = {
      originalname: 'test.pdf',
      mimetype: 'application/pdf',
      size: 1024,
    } as Express.Multer.File;

    it('should add a file to the project', async () => {
      jest.spyOn(projectModel, 'findOne').mockResolvedValue(mockProject);
      jest.spyOn(fileStorageService, 'saveFile').mockResolvedValue('saved-file-name');
      jest.spyOn(projectModel, 'findByIdAndUpdate').mockResolvedValue(mockProject);

      const result = await service.addProjectFile('professor-id', 'project-id', mockFile);

      expect(result).toBeDefined();
      expect(result.fileName).toBe('saved-file-name');
      expect(result.originalName).toBe(mockFile.originalname);
      expect(result.mimeType).toBe(mockFile.mimetype);
      expect(result.size).toBe(mockFile.size);
    });

    it('should throw NotFoundException when project not found', async () => {
      jest.spyOn(projectModel, 'findOne').mockResolvedValue(null);

      await expect(
        service.addProjectFile('professor-id', 'nonexistent-id', mockFile),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeProjectFile', () => {
    it('should remove a file from the project', async () => {
      jest.spyOn(projectModel, 'findOne').mockResolvedValue(mockProject);
      jest.spyOn(fileStorageService, 'deleteFile').mockResolvedValue(undefined);
      jest.spyOn(projectModel, 'findByIdAndUpdate').mockResolvedValue(mockProject);

      await service.removeProjectFile('professor-id', 'project-id', 'file-name');

      expect(fileStorageService.deleteFile).toHaveBeenCalledWith('file-name', true);
      expect(projectModel.findByIdAndUpdate).toHaveBeenCalled();
    });

    it('should throw NotFoundException when project or file not found', async () => {
      jest.spyOn(projectModel, 'findOne').mockResolvedValue(null);

      await expect(
        service.removeProjectFile('professor-id', 'project-id', 'file-name'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
