export interface LoginExample {
  email: string;
  password: string;
}

export const loginExamples = {
  valid: {
    summary: 'Valid Login',
    description: 'Example of a valid login request',
    value: {
      email: 'professor.test@miami.edu',
      password: 'SecurePass123!',
    },
  },
  invalidEmail: {
    summary: 'Invalid Email Domain',
    description: 'Example of login with non-miami.edu email',
    value: {
      email: 'professor@gmail.com',
      password: 'SecurePass123!',
    },
  },
};
