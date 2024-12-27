export const ApplicationSchemas = {
  Create: {
    schema: {
      type: 'object',
      required: ['application', 'resume'],
      properties: {
        application: {
          type: 'string',
          format: 'json',
          description: 'Stringified JSON containing application details. All fields are required.',
          example: JSON.stringify(
            {
              studentInfo: {
                name: {
                  firstName: 'John',
                  lastName: 'Smith',
                },
                email: 'john.smith@miami.edu',
                major: 'Computer Science',
                gpa: 3.8,
                expectedGraduation: '2025-05-15',
              },
              statement: 'I am very interested in this research opportunity because...',
            },
            null,
            2,
          ),
        },
        resume: {
          type: 'string',
          format: 'binary',
          description: 'Resume file (Must be PDF, DOC, or DOCX format, maximum size: 5MB)',
        },
      },
    },
  },
  Response: {
    schema: {
      type: 'object',
      required: [
        'id',
        'project',
        'studentInfo',
        'statement',
        'resumeFile',
        'status',
        'createdAt',
        'updatedAt',
      ],
      properties: {
        id: { type: 'string', example: '507f1f77bcf86cd799439011' },
        project: { type: 'string', example: '507f1f77bcf86cd799439012' },
        studentInfo: {
          type: 'object',
          required: ['name', 'email', 'major', 'gpa', 'expectedGraduation'],
          properties: {
            name: {
              type: 'object',
              required: ['firstName', 'lastName'],
              properties: {
                firstName: { type: 'string', example: 'John' },
                lastName: { type: 'string', example: 'Smith' },
              },
            },
            email: {
              type: 'string',
              format: 'email',
              pattern: '@miami.edu$',
              example: 'john.smith@miami.edu',
            },
            major: { type: 'string', example: 'Computer Science' },
            gpa: {
              type: 'number',
              minimum: 0,
              maximum: 4.0,
              example: 3.8,
            },
            expectedGraduation: {
              type: 'string',
              format: 'date',
              pattern: '^\d{4}-\d{2}-\d{2}$',
              example: '2025-05-15',
            },
          },
        },
        statement: {
          type: 'string',
          example: 'I am very interested in this research opportunity because...',
        },
        resumeFile: { type: 'string', example: '1709647433456-resume.pdf' },
        status: {
          type: 'string',
          enum: ['PENDING'],
          example: 'PENDING',
        },
        createdAt: { type: 'string', format: 'date-time', example: '2024-03-05T15:30:33.456Z' },
        updatedAt: { type: 'string', format: 'date-time', example: '2024-03-05T15:30:33.456Z' },
      },
    },
  },
};
