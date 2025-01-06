export const createProjectExamples = {
  draft: {
    summary: 'Draft Project',
    description: 'Example of creating a draft project',
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
    description: 'Example of creating a published project',
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
    },
  },
};

export const updateProjectExamples = {
  statusUpdate: {
    summary: 'Update Project Status',
    description: 'Example of updating project status to published',
    value: {
      status: 'PUBLISHED',
    },
  },
  fullUpdate: {
    summary: 'Full Project Update',
    description: 'Example of updating multiple project fields',
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
    },
  },
};
