export const createProfessorExamples = {
  valid: {
    summary: 'Valid Professor Registration',
    description: 'Example of a valid professor registration request',
    value: {
      email: 'professor.test@miami.edu',
      password: 'SecurePass123!',
      adminPassword: 'pass',
      name: {
        firstName: 'Jane',
        lastName: 'Smith',
      },
      department: 'Computer Science',
      title: 'Assistant Professor',
      researchAreas: ['Machine Learning', 'Computer Vision'],
      office: 'McArthur Engineering Building, Room 123',
      phoneNumber: '305-123-4567',
      bio: 'Specializing in artificial intelligence and machine learning.',
    },
  },
  minimal: {
    summary: 'Minimal Professor Registration',
    description: 'Example with only required fields',
    value: {
      email: 'professor.test@miami.edu',
      password: 'SecurePass123!',
      adminPassword: 'pass',
      name: {
        firstName: 'John',
        lastName: 'Doe',
      },
      department: 'Computer Science',
    },
  },
};

export const updateProfessorExamples = {
  fullUpdate: {
    summary: 'Full Profile Update',
    description: 'Example of updating all optional fields',
    value: {
      name: {
        firstName: 'Jane',
        lastName: 'Smith-Jones',
      },
      title: 'Associate Professor',
      researchAreas: ['Machine Learning', 'Computer Vision', 'NLP'],
      office: 'McArthur Engineering Building, Room 456',
      phoneNumber: '305-123-9876',
      bio: 'Updated research focus on deep learning applications.',
    },
  },
  partialUpdate: {
    summary: 'Partial Profile Update',
    description: 'Example of updating only specific fields',
    value: {
      title: 'Associate Professor',
      researchAreas: ['Machine Learning', 'Computer Vision'],
    },
  },
};

export const changePasswordExamples = {
  valid: {
    summary: 'Valid password change request',
    description: 'Valid password change following login flow.',
    value: {
      currentPassword: 'SecurePass123!',
      newPassword: 'NewPass456!',
    },
  },
  invalid: {
    summary: 'Invalid password change request',
    description: 'Invalid password change following login flow.',
    value: {
      currentPassword: 'IncorrectPass',
      newPassword: 'NewPass456!',
    },
  },
};

export const reactivateExamples = {
  valid: {
    summary: 'Valid Reactivation Request',
    description: 'Example of a valid account reactivation request following login flow.',
    value: {
      email: 'professor.test@miami.edu',
      password: 'SecurePass123!',
      adminPassword: 'pass',
    },
  },
  wrongAdmin: {
    summary: 'Invalid Admin Password',
    description: 'Example of an invalid account reactivation due to wrong admin password.',
    value: {
      email: 'professor.test@miami.edu',
      password: 'SecurePass123!',
      adminPassword: 'wrong-admin-pass',
    },
  },
  wrongCredentials: {
    summary: 'Invalid Credentials',
    description: 'Example of an invalid account reactivation due to wrong credentials.',
    value: {
      email: 'wrong@miami.edu',
      password: 'wrongPass',
      adminPassword: 'pass',
    },
  },
};
