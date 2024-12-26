export const AuthSchemas = {
    LoginResponse: {
      schema: {
        properties: {
          accessToken: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
          },
          professor: {
            type: 'object',
            properties: {
              id: { type: 'string', example: '507f1f77bcf86cd799439011' },
              email: { type: 'string', example: 'professor.test@miami.edu' },
              name: {
                type: 'object',
                properties: {
                  firstName: { type: 'string', example: 'John' },
                  lastName: { type: 'string', example: 'Doe' }
                }
              },
              department: { type: 'string', example: 'Computer Science' },
              title: { type: 'string', example: 'Associate Professor' }
            }
          }
        }
      }
    }
  };