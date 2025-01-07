export const createProjectExamples = {
  draft: {
    summary: 'Draft Project',
    description: 'Basic draft project with minimal required fields',
    value: {
      title: 'AI Research Assistant',
      description: 'Research project focusing on AI-powered research tools',
      researchCategories: ['Artificial Intelligence', 'Machine Learning'],
      requirements: ['Python programming', 'Machine Learning basics'],
      status: 'DRAFT',
      positions: 2,
      applicationDeadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
    },
  },
  published: {
    summary: 'Published Project',
    description: 'Fully detailed published project ready for applications',
    value: {
      title: 'Machine Learning Research Position',
      description: 'Research position in advanced ML techniques',
      researchCategories: ['Machine Learning', 'Deep Learning'],
      requirements: ['Advanced ML knowledge', 'Python expertise', 'Research experience'],
      status: 'PUBLISHED',
      positions: 3,
      applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      isVisible: true,
      additionalNotes: 'This is a funded position with possibility of publication',
      preferredQualifications: ['PhD in Computer Science', 'Publication experience'],
      projectDuration: '12 months',
      weeklyCommitment: '20 hours',
    },
  },
  maxFields: {
    summary: 'Maximum Fields Project',
    description: 'Project with all possible fields filled out',
    value: {
      title: 'Comprehensive Research Project in Quantum Computing',
      description:
        'A detailed multi-paragraph description that includes background information, ' +
        'project goals, methodology, and expected outcomes. This tests the handling of long text content.',
      researchCategories: [
        'Quantum Computing',
        'Machine Learning',
        'Algorithm Design',
        'Hardware Optimization',
      ],
      requirements: [
        'PhD in Physics or Computer Science',
        'Strong mathematics background',
        'Programming experience in Python and Q#',
        'Knowledge of quantum algorithms',
        'Experience with quantum hardware',
      ],
      status: 'DRAFT',
      positions: 5,
      applicationDeadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      isVisible: true,
      additionalNotes: 'This is a collaborative project with Industry Partner X',
      preferredQualifications: ['Industry experience', 'Publication record', 'Team leadership'],
      projectDuration: '24 months',
      weeklyCommitment: '40 hours',
      funding: 'NSF Grant',
      location: 'Hybrid - 2 days on campus required',
      teamSize: '10 researchers',
    },
  },
  edgeCase: {
    summary: 'Edge Case Project',
    description: 'Project with edge case values to test system limits',
    value: {
      title: 'A'.repeat(100), // Testing maximum title length
      description: 'A'.repeat(5000), // Testing very long description
      researchCategories: Array(20).fill('Category'), // Testing many categories
      requirements: Array(50).fill('Requirement'), // Testing many requirements
      status: 'DRAFT',
      positions: 999, // Testing large number of positions
      applicationDeadline: new Date('2099-12-31').toISOString().split('T')[0], // Far future date
      isVisible: false,
      additionalNotes: '', // Empty string
      preferredQualifications: [], // Empty array
      projectDuration: '0 months', // Edge case duration
      weeklyCommitment: '168 hours', // Maximum possible hours in a week
    },
  },
};

export const updateProjectExamples = {
  statusUpdate: {
    summary: 'Status Update',
    description: 'Simple status update from draft to published',
    value: {
      status: 'PUBLISHED',
    },
  },
  deadlineExtension: {
    summary: 'Deadline Extension',
    description: 'Extending application deadline and increasing positions',
    value: {
      applicationDeadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      positions: 5,
    },
  },
  fullUpdate: {
    summary: 'Full Project Update',
    description: 'Comprehensive update of all major fields',
    value: {
      title: 'Updated: AI Research Assistant',
      description: 'Updated project description with expanded scope',
      researchCategories: ['Artificial Intelligence', 'Natural Language Processing'],
      requirements: [
        'Strong Python programming skills',
        'Experience with ML frameworks',
        'Background in NLP',
      ],
      positions: 3,
      applicationDeadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      isVisible: true,
      additionalNotes: 'Updated project scope and requirements',
      preferredQualifications: ['Masters degree', 'Industry experience'],
      projectDuration: '18 months',
      weeklyCommitment: '25 hours',
    },
  },
  visibilityToggle: {
    summary: 'Visibility Toggle',
    description: 'Toggle project visibility without changing other fields',
    value: {
      isVisible: false,
    },
  },
  categoryUpdate: {
    summary: 'Research Categories Update',
    description: 'Update only the research categories',
    value: {
      researchCategories: ['Data Science', 'Big Data', 'Data Analytics'],
    },
  },
  edgeCaseUpdate: {
    summary: 'Edge Case Update',
    description: 'Update with edge case values',
    value: {
      title: 'A'.repeat(100),
      description: 'A'.repeat(5000),
      researchCategories: Array(20).fill('New Category'),
      requirements: Array(50).fill('New Requirement'),
      positions: 0, // Testing zero positions
      applicationDeadline: new Date('2099-12-31').toISOString().split('T')[0],
      preferredQualifications: Array(30).fill('New Qualification'),
    },
  },
};
