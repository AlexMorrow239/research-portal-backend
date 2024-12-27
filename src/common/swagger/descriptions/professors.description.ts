export const ProfessorDescriptions = {
  create: {
    summary: 'Register a new professor',
    description:
      'Create a new professor account. Requires valid miami.edu email and admin password.',
  },
  getProfile: {
    summary: 'Get professor profile',
    description: "Retrieve the authenticated professor's profile information",
  },
  updateProfile: {
    summary: 'Update professor profile',
    description: "Update the authenticated professor's profile information",
  },
  changePassword: {
    summary: 'Change professor password',
    description: "Update the authenticated professor's password",
  },
  deactivateAccount: {
    summary: 'Deactivate professor account',
    description: "Deactivate the authenticated professor's account",
  },
  reactivateAccount: {
    summary: 'Reactivate professor account',
    description: 'Reactivate a deactivated professor account. Requires admin password.',
  },
};
