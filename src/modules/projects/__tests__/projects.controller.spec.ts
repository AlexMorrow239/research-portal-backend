import { BadRequestException, NotFoundException } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';

import { createTestProfessor } from '../../../../test/utils/test-utils';
import { ProjectsController } from '../projects.controller';
import { ProjectsService } from '../projects.service';
import { ProjectStatus } from '../schemas/projects.schema';

describe('ProjectsController', () => {
  let controller: ProjectsController;
  let projectsService: ProjectsService;

  const mockProject = {
    id: 'test-project-id',
    title: 'Test Project',
    description: 'Test Description',
    researchCategories: ['Category1'],
    requirements: ['Requirement 1'],
    positions: 2,
    status: ProjectStatus.DRAFT,
    professor: {
      id: 'test-professor-id',
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
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [
        {
          provide: ProjectsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            findProfessorProjects: jest.fn(),
            addProjectFile: jest.fn(),
            removeProjectFile: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProjectsController>(ProjectsController);
    projectsService = module.get<ProjectsService>(ProjectsService);
  });

  describe('create', () => {
    it('should create a project successfully', async () => {
      const professor = await createTestProfessor();
      const createProjectDto = {
        title: 'Test Project',
        description: 'Test Description',
        department: 'Computer Science',
        requirements: ['Requirement 1'],
        positions: 2,
        status: ProjectStatus.DRAFT,
        researchCategories: ['Category1', 'Category2'],
        applicationDeadline: new Date('2024-12-31'), // Add this line
      };

      jest.spyOn(projectsService, 'create').mockResolvedValue(mockProject);

      const result = await controller.create(professor, createProjectDto);

      expect(result).toBeDefined();
      expect(result.title).toBe(mockProject.title);
      expect(projectsService.create).toHaveBeenCalledWith(professor, createProjectDto);
    });

    it('should handle validation errors', async () => {
      const professor = await createTestProfessor();
      jest.spyOn(projectsService, 'create').mockRejectedValue(new BadRequestException());

      await expect(controller.create(professor, {} as any)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return paginated projects', async () => {
      const mockResponse = {
        projects: [mockProject],
        total: 1,
      };

      jest.spyOn(projectsService, 'findAll').mockResolvedValue(mockResponse);

      const result = await controller.findAll(1, 10, 'Computer Science', ProjectStatus.PUBLISHED);

      expect(result).toBeDefined();
      expect(result.projects).toHaveLength(1);
      expect(result.total).toBe(1);
    });
  });

  describe('findProfessorProjects', () => {
    it('should return professor projects', async () => {
      const professor = await createTestProfessor();
      jest.spyOn(projectsService, 'findProfessorProjects').mockResolvedValue([mockProject]);

      const result = await controller.findProfessorProjects(professor, ProjectStatus.DRAFT);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(projectsService.findProfessorProjects).toHaveBeenCalledWith(
        professor.id,
        ProjectStatus.DRAFT,
      );
    });
  });

  describe('findOne', () => {
    it('should return a project by id', async () => {
      jest.spyOn(projectsService, 'findOne').mockResolvedValue(mockProject);

      const result = await controller.findOne('test-project-id');

      expect(result).toBeDefined();
      expect(result.id).toBe(mockProject.id);
    });

    it('should throw NotFoundException when project not found', async () => {
      jest.spyOn(projectsService, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(controller.findOne('nonexistent-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a project successfully', async () => {
      const professor = await createTestProfessor();
      const updateProjectDto = {
        title: 'Updated Project',
      };

      jest.spyOn(projectsService, 'update').mockResolvedValue({
        ...mockProject,
        title: 'Updated Project',
      });

      const result = await controller.update(professor, 'test-project-id', updateProjectDto);

      expect(result).toBeDefined();
      expect(result.title).toBe('Updated Project');
      expect(projectsService.update).toHaveBeenCalledWith(
        professor.id,
        'test-project-id',
        updateProjectDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove a project successfully', async () => {
      const professor = await createTestProfessor();
      jest.spyOn(projectsService, 'remove').mockResolvedValue(undefined);

      await controller.remove(professor, 'test-project-id');

      expect(projectsService.remove).toHaveBeenCalledWith(professor.id, 'test-project-id');
    });
  });
});
