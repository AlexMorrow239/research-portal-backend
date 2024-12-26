export const ApplicationDescriptions = {
    create: {
      summary: 'Submit a new application',
      description: `Submit a new application for a research project. The request must be multipart/form-data with two parts:
    
  Important Constraints:
  - Resume file must be PDF, DOC, or DOCX format
  - Maximum file size: 5MB
  - GPA must be between 0 and 4.0
  - All fields in the application JSON are required
  - Dates must be in ISO format (YYYY-MM-DD)`
    },
    findAll: {
      summary: 'Get project applications',
      description: 'Retrieve all applications for a specific project. Only accessible by project owner.'
    },
    updateStatus: {
      summary: 'Update application status',
      description: 'Update the status of an application. Only accessible by project owner.'
    },
    downloadResume: {
      summary: 'Download application resume',
      description: 'Download the resume/CV file for an application. Only accessible by project owner.'
    }
  };