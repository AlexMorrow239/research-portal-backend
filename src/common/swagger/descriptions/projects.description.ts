export const ProjectDescriptions = {
    create: {
      summary: 'Create a new research project',
      description: 'Creates a new research project. All dates must be in the future, and endDate must be after startDate.'
    },
    findAll: {
      summary: 'List research projects',
      description: 'Retrieve a paginated list of research projects with optional filters'
    },
    findProfessorProjects: {
      summary: 'Get professor\'s projects',
      description: 'Retrieve all projects created by the authenticated professor'
    },
    findOne: {
      summary: 'Get project by ID',
      description: 'Retrieve detailed information about a specific project'
    },
    update: {
      summary: 'Update project',
      description: 'Update an existing project. Only project owner can update.'
    },
    remove: {
      summary: 'Delete project',
      description: 'Delete a project and all associated files. Only project owner can delete.'
    },
    uploadFile: {
      summary: 'Upload project file',
      description: 'Upload a file for a project. Maximum size: 5MB. Allowed types: PDF, DOC, DOCX'
    },
    deleteFile: {
      summary: 'Delete project file',
      description: 'Delete a file from a project. Only project owner can delete files.'
    }
  };