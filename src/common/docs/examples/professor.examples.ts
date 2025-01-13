/**
 * Professor registration examples for API documentation
 */
export const createProfessorExamples = {
  valid: {
    summary: 'Complete Professor Registration',
    description: 'Example of a professor registration with all optional fields',
    value: {
      email: 'professor.test@miami.edu',
      password: 'SecurePass123!',
      adminPassword: 'adminPass123',
      name: {
        firstName: 'Jane',
        lastName: 'Smith',
      },
      department: 'Computer Science',
      title: 'Assistant Professor',
      researchAreas: [
        'Machine Learning',
        'Computer Vision',
        'Natural Language Processing',
        'Artificial Intelligence',
      ],
      office: 'McArthur Engineering Building, Room 123',
      publications: [
        {
          title: 'Machine Learning in Healthcare: A Comprehensive Review',
          link: 'https://doi.org/10.1234/example-1',
        },
        {
          title: 'Deep Learning Applications in Computer Vision',
          link: 'https://doi.org/10.1234/example-2',
        },
        {
          title: 'Natural Language Processing in Education',
          link: 'https://doi.org/10.1234/example-3',
        },
      ],
      bio: 'Dr. Jane Smith is an Assistant Professor specializing in artificial intelligence and machine learning, with a focus on healthcare applications. She has published extensively in top-tier conferences and journals.',
    },
  },
  minimal: {
    summary: 'Minimal Professor Registration',
    description: 'Example with only required fields for registration',
    value: {
      email: 'professor.test@miami.edu',
      password: 'SecurePass123!',
      adminPassword: 'adminPass123',
      name: {
        firstName: 'John',
        lastName: 'Doe',
      },
      office: 'McArthur Engineering Building, Room 123',
      department: 'Computer Science',
    },
  },
};

/**
 * Professor profile update examples for API documentation
 */
export const updateProfessorExamples = {
  fullUpdate: {
    summary: 'Complete Profile Update',
    description: 'Example of updating all available profile fields',
    value: {
      name: {
        firstName: 'Jane',
        lastName: 'Smith-Jones',
      },
      department: 'Computer Science and Engineering',
      title: 'Associate Professor',
      researchAreas: ['Machine Learning', 'Computer Vision', 'NLP', 'Edge Computing', 'IoT'],
      office: 'McArthur Engineering Building, Room 456',
      publications: [
        {
          title: 'Edge Computing in IoT Applications',
          link: 'https://doi.org/10.1234/example-4',
        },
        {
          title: 'Advanced Machine Learning Techniques',
          link: 'https://doi.org/10.1234/example-5',
        },
      ],
      bio: 'Recently promoted to Associate Professor with expanded research focus including edge computing and IoT applications.',
    },
  },
  partialUpdate: {
    summary: 'Partial Profile Update',
    description: 'Example of updating specific fields while leaving others unchanged',
    value: {
      title: 'Associate Professor',
      researchAreas: ['Machine Learning', 'Computer Vision'],
      office: 'McArthur Engineering Building, Room 789',
    },
  },
};

/**
 * Password change examples for API documentation
 */
export const changePasswordExamples = {
  valid: {
    summary: 'Valid Password Change',
    description: 'Example of a valid password change request',
    value: {
      currentPassword: 'CurrentPass123!',
      newPassword: 'NewSecurePass456!',
    },
  },
  invalid: {
    summary: 'Invalid Password Change',
    description: 'Example of an invalid password change request',
    value: {
      currentPassword: 'WrongCurrentPass123!',
      newPassword: 'weak', // Too weak, missing requirements
    },
  },
};

/**
 * Account reactivation examples for API documentation
 */
export const reactivateExamples = {
  valid: {
    summary: 'Valid Reactivation Request',
    description: 'Example of a valid account reactivation request',
    value: {
      email: 'professor.test@miami.edu',
      password: 'SecurePass123!',
      adminPassword: 'adminPass123',
    },
  },
  wrongAdmin: {
    summary: 'Invalid Admin Password',
    description: 'Example of a reactivation request with incorrect admin password',
    value: {
      email: 'professor.test@miami.edu',
      password: 'SecurePass123!',
      adminPassword: 'wrongAdminPass',
    },
  },
  wrongCredentials: {
    summary: 'Invalid Professor Credentials',
    description: 'Example of a reactivation request with incorrect professor credentials',
    value: {
      email: 'wrong@miami.edu',
      password: 'WrongPass123!',
      adminPassword: 'adminPass123',
    },
  },
};
