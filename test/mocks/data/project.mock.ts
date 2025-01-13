import { CreateProjectDto, ProjectResponseDto } from '@/common/dto/projects';
import { ProjectStatus } from '@/modules/projects/schemas/projects.schema';

export const createMockProject = (
  override: Partial<ProjectResponseDto> = {},
): ProjectResponseDto => ({
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
  isVisible: true,
  files: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  applicationDeadline: new Date('2024-12-31'),
  ...override,
});

export const createMockCreateProjectDto = (
  override: Partial<CreateProjectDto> = {},
): CreateProjectDto => ({
  title: 'Test Project',
  description: 'Test Description',
  requirements: ['Requirement 1'],
  positions: 2,
  status: ProjectStatus.DRAFT,
  researchCategories: ['Category1'],
  applicationDeadline: new Date('2024-12-31'),
  ...override,
});
