export const ProjectDescriptions = {
  create: {
    summary: 'Create a new project',
    description: 'Creates a new project for the authenticated professor',
  },
  findAll: {
    summary: 'Get all projects',
    description: 'Retrieves all projects with optional filtering and pagination',
  },
  findProfessorProjects: {
    summary: 'Get professor projects',
    description: 'Retrieves all projects belonging to the authenticated professor',
  },
  findOne: {
    summary: 'Get project by ID',
    description: 'Retrieves a specific project by its ID',
  },
  update: {
    summary: 'Update project',
    description: 'Updates a project by its ID. Only the project owner can update it',
  },
  remove: {
    summary: 'Delete project',
    description: 'Deletes a project by its ID. Only the project owner can delete it',
  },
  uploadFile: {
    summary: 'Upload project file',
    description:
      'Uploads a file to a specific project. Supports PDF, DOC, and DOCX formats up to 5MB',
  },
  deleteFile: {
    summary: 'Delete project file',
    description: 'Deletes a file from a specific project',
  },
};
