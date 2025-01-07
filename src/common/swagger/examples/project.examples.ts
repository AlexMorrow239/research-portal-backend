export const createProjectExamples = {
  complete: {
    summary: 'Complete Project Creation',
    description: 'Example of creating a project with all optional fields',
    value: {
      title: 'Machine Learning Research Assistant',
      description: `Seeking motivated research assistants for an exciting ML project focusing on computer vision and deep learning applications in healthcare. The project involves developing novel algorithms for medical image analysis using state-of-the-art deep learning techniques.`,
      researchCategories: [
        'Machine Learning',
        'Computer Vision',
        'Artificial Intelligence',
        'Healthcare',
        'Deep Learning',
      ],
      requirements: [
        'Strong programming skills in Python',
        'Experience with PyTorch or TensorFlow',
        'Background in linear algebra and statistics',
        'Familiarity with computer vision concepts',
        'Good understanding of deep learning architectures',
        'Ability to work 15-20 hours per week',
      ],
      status: 'PUBLISHED',
      positions: 2,
      applicationDeadline: '2024-12-31T23:59:59.999Z',
      isVisible: true,
    },
  },
  minimal: {
    summary: 'Minimal Project Creation',
    description: 'Example of creating a project with only required fields',
    value: {
      title: 'Research Assistant Needed',
      description: 'Seeking assistance for ongoing research project in computer science.',
      researchCategories: ['Computer Science'],
      requirements: ['Programming experience'],
      status: 'DRAFT',
      positions: 1,
    },
  },
  draft: {
    summary: 'Draft Project Creation',
    description: 'Example of creating a draft project for later publication',
    value: {
      title: 'Data Science Research Project (Draft)',
      description: `Draft description for upcoming research project in data science. Project details and requirements to be finalized.`,
      researchCategories: ['Data Science', 'Statistics', 'Machine Learning'],
      requirements: [
        'Statistics background',
        'R or Python experience',
        'Data visualization skills',
      ],
      status: 'DRAFT',
      positions: 2,
      applicationDeadline: '2024-12-31T23:59:59.999Z',
      isVisible: false,
    },
  },
};

export const updateProjectExamples = {
  fullUpdate: {
    summary: 'Full Project Update',
    description: 'Example of updating all available fields',
    value: {
      title: 'Updated: ML Research Position',
      description: `
        Updated project description with expanded scope and new requirements.
        Now including natural language processing components and cloud computing aspects.
        
        Additional responsibilities:
        - NLP model development
        - Cloud infrastructure setup
        - Performance optimization
      `,
      researchCategories: [
        'Machine Learning',
        'Deep Learning',
        'Natural Language Processing',
        'Cloud Computing',
      ],
      requirements: [
        'Advanced Python programming skills',
        'Experience with NLP libraries',
        'Knowledge of cloud platforms (AWS/GCP)',
        'Strong mathematical background',
      ],
      status: 'PUBLISHED',
      positions: 3,
      applicationDeadline: '2024-12-31T23:59:59.999Z',
      isVisible: true,
    },
  },
  statusUpdate: {
    summary: 'Status Update',
    description: 'Example of updating only the project status',
    value: {
      status: 'PUBLISHED',
    },
  },
  visibilityUpdate: {
    summary: 'Visibility Update',
    description: 'Example of updating project visibility',
    value: {
      isVisible: false,
      status: 'DRAFT',
    },
  },
  deadlineUpdate: {
    summary: 'Deadline Update',
    description: 'Example of updating application deadline',
    value: {
      applicationDeadline: '2025-06-30T23:59:59.999Z',
    },
  },
  requirementsUpdate: {
    summary: 'Requirements Update',
    description: 'Example of updating project requirements',
    value: {
      requirements: [
        'Updated technical requirements',
        'New skill prerequisites',
        'Additional time commitments',
      ],
    },
  },
};

export const projectFileExamples = {
  validFile: {
    summary: 'Valid File Upload',
    description: 'Example of a valid file upload request',
    value: {
      file: 'project-description.pdf', // Binary file data
    },
  },
  pdfFile: {
    summary: 'PDF File Upload',
    description: 'Example of uploading a PDF document',
    value: {
      file: 'detailed-requirements.pdf', // Binary file data
    },
  },
  wordFile: {
    summary: 'Word Document Upload',
    description: 'Example of uploading a Word document',
    value: {
      file: 'research-proposal.docx', // Binary file data
    },
  },
  invalidFile: {
    summary: 'Invalid File Upload',
    description: 'Example of an invalid file upload attempt',
    value: {
      file: 'large-video.mp4', // Unsupported file type
    },
  },
};

export const findAllExamples = {
  basic: {
    summary: 'Basic Search',
    description: 'Example of basic project search',
    value: {
      page: 1,
      limit: 10,
      status: 'PUBLISHED',
    },
  },
  advanced: {
    summary: 'Advanced Search',
    description: 'Example of advanced project search with filters',
    value: {
      page: 1,
      limit: 20,
      department: 'Computer Science',
      status: 'PUBLISHED',
      search: 'machine learning',
      researchCategories: ['AI', 'Machine Learning'],
    },
  },
  departmentFilter: {
    summary: 'Department Filter',
    description: 'Example of filtering projects by department',
    value: {
      department: 'Computer Science',
      page: 1,
      limit: 10,
    },
  },
  categoryFilter: {
    summary: 'Category Filter',
    description: 'Example of filtering projects by research categories',
    value: {
      researchCategories: ['Machine Learning', 'Artificial Intelligence'],
      page: 1,
      limit: 10,
    },
  },
  textSearch: {
    summary: 'Text Search',
    description: 'Example of searching projects by text',
    value: {
      search: 'artificial intelligence healthcare',
      page: 1,
      limit: 10,
    },
  },
};

export const findProfessorProjectsExamples = {
  allProjects: {
    summary: 'All Professor Projects',
    description: 'Example of retrieving all projects for a professor',
    value: {
      status: undefined, // Returns projects of all statuses
    },
  },
  draftProjects: {
    summary: 'Draft Projects',
    description: 'Example of retrieving only draft projects',
    value: {
      status: 'DRAFT',
    },
  },
  publishedProjects: {
    summary: 'Published Projects',
    description: 'Example of retrieving only published projects',
    value: {
      status: 'PUBLISHED',
    },
  },
  archivedProjects: {
    summary: 'Archived Projects',
    description: 'Example of retrieving only archived projects',
    value: {
      status: 'ARCHIVED',
    },
  },
};

export const deleteFileExamples = {
  validDelete: {
    summary: 'Valid File Deletion',
    description: 'Example of a valid file deletion request',
    value: {
      fileName: 'project-description.pdf',
    },
  },
  invalidDelete: {
    summary: 'Invalid File Deletion',
    description: 'Example of an invalid file deletion request',
    value: {
      fileName: 'nonexistent-file.pdf',
    },
  },
};
