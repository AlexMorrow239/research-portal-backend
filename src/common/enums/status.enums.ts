/**
 * Enums for tracking status states across the application
 * Contains status definitions for applications and projects
 */

/**
 * Represents the current status of an application
 * Used to track application lifecycle from submission to closure
 */
export enum ApplicationStatus {
  /** Initial state when application is submitted */
  PENDING = 'PENDING',
  /** Final state when application process is complete */
  CLOSED = 'CLOSED',
}

/**
 * Represents the current status of a project
 * Used to track project lifecycle from creation to closure
 */
export enum ProjectStatus {
  /** Initial state when project is being created */
  DRAFT = 'DRAFT',
  /** Project is visible and accepting applications */
  PUBLISHED = 'PUBLISHED',
  /** Project is no longer accepting applications */
  CLOSED = 'CLOSED',
}
