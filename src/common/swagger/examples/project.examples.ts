// Helper function to generate dates
const getFutureDate = (months: number) => {
  const date = new Date();
  date.setMonth(date.getMonth() + months); // 6 months in the future
  return date.toISOString();
};

const getPastDate = () => {
  const date = new Date();
  date.setMonth(date.getMonth() - 1); // 1 month in the past
  return date.toISOString();
};

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
      applicationDeadline: getFutureDate(6),
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
      applicationDeadline: getFutureDate(6),
      isVisible: false,
    },
  },
  invalidDeadline: {
    summary: 'Invalid Deadline',
    description: 'Example of project creation with past deadline (will fail validation)',
    value: {
      title: 'Invalid Project',
      description: 'This project has an invalid past deadline.',
      researchCategories: ['Computer Science'],
      requirements: ['Programming experience'],
      status: 'DRAFT',
      positions: 1,
      applicationDeadline: getPastDate(), // Dynamic past date
    },
  },
};

export const updateProjectExamples = {
  fullUpdate: {
    summary: 'Full Project Update',
    description: 'Example of updating all available fields',
    value: {
      title: 'Updated: ML Research Position',
      description: `Updated project description with expanded scope and new requirements. Now including natural language processing components and cloud computing aspects.`,
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
      applicationDeadline: getFutureDate(4),
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
      applicationDeadline: getFutureDate(4),
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
