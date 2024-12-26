export const ProjectSchemas = {
    ProjectFile: {
      schema: {
        type: 'object',
        required: ['file'],
        properties: {
          file: {
            type: 'string',
            format: 'binary',
            description: 'File to upload (PDF, DOC, DOCX only, max 5MB)'
          }
        }
      }
    },
    ProjectList: {
      schema: {
        properties: {
          projects: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', example: '507f1f77bcf86cd799439011' },
                title: { type: 'string', example: 'Research Project Title' },
                description: { type: 'string', example: 'Project description...' },
                department: { type: 'string', example: 'Computer Science' },
                startDate: { type: 'string', format: 'date', example: '2024-06-01' },
                endDate: { type: 'string', format: 'date', example: '2024-08-31' },
                status: { type: 'string', enum: ['DRAFT', 'PUBLISHED', 'CLOSED'], example: 'PUBLISHED' },
                positions: { type: 'number', example: 2 },
                applicationDeadline: { type: 'string', format: 'date', example: '2024-05-15' }
              }
            }
          },
          total: {
            type: 'number',
            example: 50
          }
        }
      }
    }
  };