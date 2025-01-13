export const AnalyticsDescriptions = {
  getProjectAnalytics: {
    summary: 'Get project analytics',
    description: `
      Retrieve comprehensive analytics for a specific project including:
      - Email engagement metrics (sent, views, clicks)
      - Application funnel statistics
      - Conversion rates and success metrics
      
      Access Rules:
      - Requires authentication
      - Only accessible by project owner
      - Real-time aggregated data
    `,
  },
  getGlobalAnalytics: {
    summary: 'Get global analytics',
    description: `
      Retrieve platform-wide analytics aggregating data across all projects:
      - Total email engagement metrics
      - Overall application funnel statistics
      - Platform-wide conversion rates
      
      Access Rules:
      - Requires authentication
      - Available to all authenticated professors
      - Real-time aggregated data
    `,
  },
  responses: {
    retrieved: 'Analytics data successfully retrieved',
    unauthorized: 'Authentication required to access analytics',
    notFound: 'Project not found or no analytics available',
    serverError: 'Error retrieving analytics data',
  },
};
