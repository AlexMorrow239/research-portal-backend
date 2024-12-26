export const createProjectExamples = {
    draft: {
      summary: 'Draft Project',
      description: 'Example of creating a draft project',
      value: {
        title: 'AI Research Assistant',
        description: 'Research project focusing on AI-powered research tools',
        department: 'Computer Science',
        requirements: ['Python programming', 'Machine Learning basics'],
        startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'DRAFT',
        positions: 2,
        tags: ['AI', 'ML'],
        applicationDeadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }
    },
    published: {
      summary: 'Published Project',
      description: 'Example of creating a published project',
      value: {
        title: 'Machine Learning Research Position',
        description: 'Research position in advanced ML techniques',
        department: 'Computer Science',
        requirements: ['Advanced ML knowledge', 'Python expertise', 'Research experience'],
        startDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date(Date.now() + 240 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'PUBLISHED',
        positions: 3,
        tags: ['Machine Learning', 'Deep Learning', 'Research'],
        applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }
    }
  };
  
export const updateProjectExamples = {
statusUpdate: {
    summary: 'Update Project Status',
    description: 'Example of updating project status to published',
    value: {
    status: 'PUBLISHED'
    }
},
fullUpdate: {
    summary: 'Full Project Update',
    description: 'Example of updating multiple project fields',
    value: {
    title: 'Updated: AI Research Assistant',
    description: 'Updated project description with expanded scope',
    requirements: [
        'Strong Python programming skills',
        'Experience with ML frameworks',
        'Background in NLP'
    ],
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    positions: 3,
    tags: ['AI', 'ML', 'NLP'],
    applicationDeadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }
}
};