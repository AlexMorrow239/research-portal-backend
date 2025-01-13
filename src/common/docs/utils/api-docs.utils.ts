/**
 * Utility functions and constants for API documentation
 */

// Date helper functions for examples
export const dateUtils = {
  getFutureDate: (months: number): string => {
    const date = new Date();
    date.setMonth(date.getMonth() + months);
    return date.toISOString();
  },

  getPastDate: (months = 1): string => {
    const date = new Date();
    date.setMonth(date.getMonth() - months);
    return date.toISOString();
  },
};

// Documentation structure comments
export const docStructure = {
  decorators: `
Decorators (*.decorator.ts)
- Contains Swagger decorators for API endpoints
- Each decorator composes multiple Swagger annotations
- Provides consistent API documentation structure`,

  descriptions: `
Descriptions (*.description.ts)
- Contains detailed API endpoint descriptions
- Reused across decorators and Swagger documentation
- Maintains consistent API documentation language`,

  examples: `
Examples (*.examples.ts)
- Contains example request/response payloads
- Used in Swagger documentation to demonstrate API usage
- Provides realistic use cases for API endpoints`,
};
