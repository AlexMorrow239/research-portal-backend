export const AuthDescriptions = {
  login: {
    summary: 'Professor Authentication',
    description: `
      Authenticate a professor using their University of Miami credentials.
      
      Requirements:
      - Email must be a valid miami.edu address
      - Password must match the account password
      
      Authentication Process:
      1. Submit miami.edu email and password
      2. On successful login, you'll receive an access token
      3. Click the 'Authorize' button at the top
      4. Enter 'Bearer <your_token>' in the value field
      5. You can now access protected endpoints
      
      Note: Tokens expire after 24 hours and will need to be renewed.
    `,
  },
  responses: {
    loginSuccess: 'Authentication successful. Use the returned token for subsequent requests.',
    invalidCredentials: 'The provided email or password is incorrect.',
    inactiveAccount: 'This account has been deactivated. Please contact administration.',
    invalidEmailDomain: 'Only miami.edu email addresses are accepted.',
    tooManyAttempts: 'Too many failed login attempts. Please try again later.',
    serverError: 'An unexpected error occurred during authentication.',
  },
};
