export const ApplicationDescriptions = {
  create: {
    summary: 'Submit new application',
    description: 'Submit a new application for a research project with resume attachment',
    constraints: `Important Constraints:
    - Resume file must be PDF, DOC, or DOCX format
    - Maximum file size: 5MB
    - GPA must be between 0 and 4.0
    - All fields in the application JSON are required
    - Dates must be in ISO format (YYYY-MM-DD)`,
  },
  findAll: {
    summary: 'Get project applications',
    description:
      'Retrieve all applications for a specific project. Only accessible by project owner.',
  },
  updateStatus: {
    summary: 'Update application status',
    description: 'Update the status of an application. Only accessible by project owner.',
  },
  downloadResume: {
    summary: 'Download application resume',
    description: 'Download the resume file for an application. Only accessible by project owner.',
  },
  params: {
    projectId: {
      name: 'projectId',
      description: 'Project identifier',
      example: '507f1f77bcf86cd799439011',
    },
    applicationId: {
      name: 'applicationId',
      description: 'Application identifier',
      example: '507f1f77bcf86cd799439012',
    },
  },
};

export const applicationSwaggerFileSchema = {
  type: 'object',
  required: ['application', 'resume'],
  properties: {
    application: { type: 'object', $ref: '#/components/schemas/CreateApplicationDto' },
    resume: {
      type: 'string',
      format: 'binary',
      description: 'Resume file (PDF, DOC, or DOCX)',
    },
  },
};

export const applicationResumeResponseContent = {
  'application/pdf': {},
  'application/msword': {},
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {},
};
