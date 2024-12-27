export const createApplicationExamples = {
  strong: {
    summary: 'Strong Application',
    description: 'Example of a strong student application',
    value: {
      application: JSON.stringify({
        studentInfo: {
          name: {
            firstName: 'Alice',
            lastName: 'Johnson',
          },
          email: 'alice.johnson@miami.edu',
          major: 'Computer Science',
          gpa: 3.95,
          expectedGraduation: '2025-05-15',
        },
        statement:
          'I am passionate about AI research and have completed relevant coursework in machine learning and neural networks. I have also contributed to open-source ML projects...',
      }),
    },
  },
  basic: {
    summary: 'Basic Application',
    description: 'Example of a basic student application',
    value: {
      application: JSON.stringify({
        studentInfo: {
          name: {
            firstName: 'Bob',
            lastName: 'Smith',
          },
          email: 'bob.smith@miami.edu',
          major: 'Computer Science',
          gpa: 3.2,
          expectedGraduation: '2025-12-15',
        },
        statement: 'I am interested in gaining research experience in artificial intelligence...',
      }),
    },
  },
};

export const updateApplicationStatusExamples = {
  accept: {
    summary: 'Accept Application',
    description: 'Example of accepting an application with notes',
    value: {
      status: 'ACCEPTED',
      professorNotes: 'Strong candidate with excellent qualifications and relevant experience.',
    },
  },
  reject: {
    summary: 'Reject Application',
    description: 'Example of rejecting an application with feedback',
    value: {
      status: 'REJECTED',
      professorNotes:
        'Thank you for your interest, but we are looking for candidates with more research experience.',
    },
  },
};
