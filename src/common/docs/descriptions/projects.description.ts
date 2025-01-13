export const ProjectDescriptions = {
  create: {
    summary: 'Create a new research project',
    description: `
      Create a new research project with the following requirements:
      - Must be authenticated as a professor
      - Title and description are required
      - At least one research category must be specified
      - Project status can be DRAFT or PUBLISHED
      - Number of positions must be at least 1
      - Application deadline must be in the future (optional)
      - Files can be attached after creation
      
      Notes:
      - Draft projects are only visible to the owner
      - Published projects are visible to all users
      - Research categories help students find relevant projects
      - Requirements should be specific and clear
    `,
  },
  findAll: {
    summary: 'Find all research projects',
    description: `
      Retrieve a paginated list of research projects with optional filters:
      - Page and limit for pagination (default: page 1, limit 10)
      - Department filter (e.g., "Computer Science")
      - Status filter (default: PUBLISHED)
      - Text search in title and description
      - Research categories filter (comma-separated)
      
      Additional Features:
      - Results are sorted by creation date (newest first)
      - Only published and visible projects are returned
      - Department filter matches professor's department
      - Search is case-insensitive and supports partial matches
      - Multiple research categories use OR logic
    `,
  },
  findProfessorProjects: {
    summary: "Find professor's projects",
    description: `
      Retrieve all projects created by the authenticated professor.
      
      Features:
      - Can be filtered by project status (DRAFT, PUBLISHED, or ARCHIVED)
      - Includes both visible and hidden projects
      - Returns full project details including files and applications
      - Sorted by last update date (newest first)
      - No pagination - returns all projects
      - Includes draft and archived projects
      - Shows application statistics
      - Displays file attachments
    `,
  },
  findOne: {
    summary: 'Find project by ID',
    description: `
      Retrieve detailed information about a specific project including:
      - Project details and requirements
      - Professor information
      - Research categories
      - Attached files
      - Application status and deadline
      - Current number of applications
      - Project visibility status
      
      Access Rules:
      - Published projects are visible to all
      - Draft projects are only visible to the owner
      - Archived projects maintain limited visibility
      - File access follows project visibility rules
    `,
  },
  update: {
    summary: 'Update project',
    description: `
      Update an existing project. Only the project owner can perform updates.
      
      Update Rules:
      - All fields are optional - only provided fields will be updated
      - Status changes trigger notifications to applicants
      - File attachments must be managed separately
      - Cannot modify professor ownership
      - Draft projects can be fully modified
      - Published projects have limited modifications
      - Archived projects cannot be modified
      
      Status Transitions:
      - DRAFT → PUBLISHED: Project becomes visible
      - PUBLISHED → DRAFT: Project becomes hidden
      - PUBLISHED → ARCHIVED: Applications closed
      - ARCHIVED: No further modifications allowed
    `,
  },
  remove: {
    summary: 'Delete project',
    description: `
      Permanently delete a project. Only the project owner can delete their projects.
      
      Deletion Process:
      - All associated files will be deleted from storage
      - All applications will be archived
      - Action cannot be undone
      - Requires professor authentication
      - Notifications sent to applicants
      - Project data completely removed
      
      Restrictions:
      - Cannot delete projects with accepted applications
      - Archived projects require admin approval
      - Must be project owner
    `,
  },
  uploadFile: {
    summary: 'Upload project file',
    description: `
      Upload a file attachment for the project.
      
      File Requirements:
      - Maximum file size: 5MB
      - Allowed file types: PDF, DOC, DOCX
      - Only project owner can upload files
      - Files are stored securely and linked to the project
      - Maximum 10 files per project
      - Duplicate filenames are automatically handled
      
      Storage Rules:
      - Files are scanned for viruses
      - Original filenames are preserved
      - Secure access controls applied
      - Automatic file type verification
      - Metadata is stored with file
    `,
  },
  deleteFile: {
    summary: 'Delete project file',
    description: `
      Remove a file attachment from the project.
      
      Deletion Rules:
      - Only project owner can delete files
      - File is permanently deleted from storage
      - Project reference is removed
      - Filename must match exactly
      - Action cannot be undone
      - No impact on other project data
      
      Restrictions:
      - Cannot delete required files
      - Must have project write access
      - File must exist in project
    `,
  },
  responses: {
    // Success Responses
    created: 'Project successfully created with provided details',
    retrieved: 'Project(s) successfully retrieved with all requested data',
    updated: 'Project successfully updated with provided changes',
    deleted: 'Project and all associated data successfully deleted',
    fileUploaded: 'File successfully uploaded and linked to project',
    fileDeleted: 'File successfully deleted from project and storage',

    // Error Responses
    notFound: 'Requested project or resource not found',
    unauthorized: 'Not authorized to perform this action on the project',
    invalidData: 'Invalid or malformed project data provided',
    invalidFile: 'File type not allowed or file is corrupted',
    fileQuotaExceeded: 'Maximum number of files (10) reached for this project',
    duplicateFile: 'A file with this name already exists in the project',
    invalidFileType: 'File type not allowed (PDF, DOC, DOCX only)',
    fileSizeTooLarge: 'File size exceeds maximum limit of 5MB',
    projectLocked: 'Project cannot be modified in its current status',
    ownershipRequired: 'Only the project owner can perform this action',
    serverError: 'An unexpected error occurred while processing the request',
    validationError: 'One or more validation rules failed',
    deadlinePassed: 'Application deadline has already passed',
    maxPositionsReached: 'Maximum number of positions already filled',
    archiveError: 'Cannot modify archived project',
    statusTransitionError: 'Invalid project status transition',
  },
};
