/**
 * Examples of authentication requests for API documentation
 */
export const loginExamples = {
  valid: {
    summary: 'Valid Login Credentials',
    description: 'Example of a valid login request with miami.edu email',
    value: {
      email: 'professor.test@miami.edu',
      password: 'SecurePass123!',
    },
  },
  invalidEmail: {
    summary: 'Invalid Email Domain',
    description: 'Example of an invalid login attempt with non-miami.edu email',
    value: {
      email: 'professor@gmail.com',
      password: 'SecurePass123!',
    },
  },
  deactivatedAccount: {
    summary: 'Deactivated Account',
    description: 'Example of login attempt with a deactivated account',
    value: {
      email: 'inactive.professor@miami.edu',
      password: 'SecurePass123!',
    },
  },
  invalidFormat: {
    summary: 'Invalid Format',
    description: 'Example of login attempt with invalid data format',
    value: {
      email: 'not-an-email',
      password: '',
    },
  },
};
