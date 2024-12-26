export const createProfessorExamples = {
    valid: {
      summary: 'Valid Professor Registration',
      description: 'Example of a valid professor registration request',
      value: {
        email: 'new.professor@miami.edu',
        password: 'SecurePass123!',
        adminPassword: 'admin_secret_password',
        name: {
          firstName: 'Jane',
          lastName: 'Smith'
        },
        department: 'Computer Science',
        title: 'Assistant Professor',
        researchAreas: ['Machine Learning', 'Computer Vision'],
        office: 'McArthur Engineering Building, Room 123',
        phoneNumber: '305-123-4567',
        bio: 'Specializing in artificial intelligence and machine learning.'
      }
    },
    minimal: {
      summary: 'Minimal Professor Registration',
      description: 'Example with only required fields',
      value: {
        email: 'minimal@miami.edu',
        password: 'SecurePass123!',
        adminPassword: 'admin_secret_password',
        name: {
          firstName: 'John',
          lastName: 'Doe'
        },
        department: 'Computer Science'
      }
    }
  };

export const updateProfessorExamples = {
fullUpdate: {
    summary: 'Full Profile Update',
    description: 'Example of updating all optional fields',
    value: {
    name: {
        firstName: 'Jane',
        lastName: 'Smith-Jones'
    },
    title: 'Associate Professor',
    researchAreas: ['Machine Learning', 'Computer Vision', 'NLP'],
    office: 'McArthur Engineering Building, Room 456',
    phoneNumber: '305-123-9876',
    bio: 'Updated research focus on deep learning applications.'
    }
},
partialUpdate: {
    summary: 'Partial Profile Update',
    description: 'Example of updating only specific fields',
    value: {
    title: 'Associate Professor',
    researchAreas: ['Machine Learning', 'Computer Vision']
    }
}
};