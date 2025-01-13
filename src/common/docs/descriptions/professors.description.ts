export const ProfessorDescriptions = {
  create: {
    summary: 'Register a new professor',
    description: `
      Create a new professor account with the following requirements:
      - Email must be a valid miami.edu address
      - Password must be at least 8 characters long and include uppercase, lowercase, number, and special character
      - Admin password is required for registration
      - Required fields: email, password, name (first & last), department, office
      - Optional fields: title, researchAreas, publications, bio
    `,
  },
  getProfile: {
    summary: 'Get professor profile',
    description: `
      Retrieve the authenticated professor's complete profile information.
      Requires a valid JWT token in the Authorization header.
    `,
  },
  updateProfile: {
    summary: 'Update professor profile',
    description: `
      Update the authenticated professor's profile information.
      - All fields are optional
      - Only provided fields will be updated
      - Email and password cannot be updated through this endpoint
      - Requires a valid JWT token in the Authorization header
    `,
  },
  changePassword: {
    summary: 'Change professor password',
    description: `
      Update the authenticated professor's password.
      Requirements:
      - Current password must be valid
      - New password must be at least 8 characters long
      - Must include uppercase, lowercase, number, and special character
      - New password cannot be the same as the current password
      - Requires a valid JWT token in the Authorization header
    `,
  },
  deactivateAccount: {
    summary: 'Deactivate professor account',
    description: `
      Deactivate the authenticated professor's account.
      - Account can be reactivated later with admin approval
      - All active sessions will be terminated
      - Requires a valid JWT token in the Authorization header
    `,
  },
  reactivateAccount: {
    summary: 'Reactivate professor account',
    description: `
      Reactivate a previously deactivated professor account.
      Requirements:
      - Valid professor credentials (email and password)
      - Valid admin password
      - Account must be currently deactivated
    `,
  },
  responses: {
    createSuccess: 'Professor account successfully created with provided details',
    invalidAdminPassword: 'The provided admin password is incorrect or invalid',
    emailExists: 'A professor account with this email address already exists',
    profileRetrieved: 'Professor profile successfully retrieved',
    profileUpdated: 'Professor profile successfully updated with provided changes',
    notAuthenticated: 'Authentication failed. Please provide a valid JWT token',
    invalidInput: 'The provided input data is invalid or malformed',
    passwordChanged: 'Professor password successfully changed',
    invalidCurrentPassword: 'The provided current password is incorrect',
    invalidPasswordFormat: 'New password does not meet the required format criteria',
    accountDeactivated: 'Professor account successfully deactivated',
    accountReactivated: 'Professor account successfully reactivated',
    invalidCredentials: 'The provided professor credentials or admin password are invalid',
    accountAlreadyActive: 'This professor account is already active',
    serverError: 'An unexpected error occurred while processing the request',
    forbidden: 'You do not have permission to perform this action',
  },
};
