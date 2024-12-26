export const ErrorSchemas = {
    BadRequest: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { 
          type: 'array', 
          items: { type: 'string' },
          example: [
            'firstName is required',
            'Email must be from @miami.edu domain',
            'GPA must be between 0 and 4.0'
          ]
        },
        error: { type: 'string', example: 'Bad Request' }
      }
    },
    Unauthorized: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Invalid credentials' },
        error: { type: 'string', example: 'Unauthorized' }
      }
    },
    NotFound: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Resource not found' },
        error: { type: 'string', example: 'Not Found' }
      }
    }
  };