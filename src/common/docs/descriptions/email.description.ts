export const EmailDescriptions = {
  trackClick: {
    summary: 'Track email click',
    description: `
      Track when a recipient clicks an email link and record analytics.
      
      Features:
      - Records click timestamp
      - Updates view status
      - Increments click counter
      - Stores first click time
      
      Note: Each token can only be used once for tracking.
    `,
  },
  createTestToken: {
    summary: 'Create test tracking token',
    description: `
      Create a test tracking token for development purposes.
      Only available in non-production environments.
      
      Requirements:
      - Valid application ID
      - Valid project ID
      - Development environment
    `,
  },
  getStats: {
    summary: 'Get email tracking statistics',
    description: `
      Retrieve global email tracking statistics including:
      - Total emails sent
      - Total clicks
      - Average clicks per email
      - View rates
      - Project-specific statistics
      
      Access Rules:
      - Requires authentication
      - Available to all authenticated professors
      - Real-time aggregated data
    `,
  },
  responses: {
    tracked: 'Email click tracked successfully',
    tokenCreated: 'Test tracking token created successfully',
    statsRetrieved: 'Email statistics retrieved successfully',
    invalidToken: 'Invalid tracking token',
    unauthorized: 'Authentication required',
    notFound: 'Resource not found',
  },
};
