import { WeeklyAvailability, ProjectLength, ApplicationStatus } from '@/common/enums';

export const ApplicationDescriptions = {
  create: {
    summary: 'Submit new application',
    description: `Submit a new application for a research project with resume attachment.
    
    Valid Weekly Hours: ${Object.values(WeeklyAvailability).join(', ')}
    Valid Project Lengths: ${Object.values(ProjectLength).join(', ')}
    
    Important Constraints:
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
    description: `Update the status of a student's application. Only accessible by project owner.
    
    Valid Status Values:
    ${Object.values(ApplicationStatus).join(', ')}
    
    Status Transition Rules:
    - PENDING → ACCEPTED/REJECTED: Initial decision
    - PENDING → WITHDRAWN: Student withdraws application
    - ACCEPTED → WITHDRAWN: Student declines offer
    - REJECTED: Final state, no further transitions
    - WITHDRAWN: Final state, no further transitions
    
    Important Notes:
    - Status updates trigger email notifications
    - Cannot change status of withdrawn applications
    - Cannot undo rejection or withdrawal
    - Must be project owner to update status
    - Previous status is recorded in history`,
  },

  responses: {
    statusUpdated: 'Application status updated successfully and notifications sent',
    invalidTransition: 'Invalid status transition requested',
    alreadyProcessed: 'Application has already been processed (rejected/withdrawn)',
    notFound: 'Application or project not found',
    unauthorized: 'Not authorized to update this application',
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
