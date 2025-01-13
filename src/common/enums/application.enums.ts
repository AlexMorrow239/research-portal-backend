/**
 * Enums for application-related data
 * Contains definitions for demographic and academic information
 */

/**
 * Racial and ethnic group categories
 * Based on standard demographic classifications
 */
export enum RacialEthnicGroup {
  AMERICAN_INDIAN = 'American Indian or Indian Alaskan',
  BLACK = 'Black or African American',
  HISPANIC = 'Hispanic/Latino',
  NATIVE_HAWAIIAN = 'Native Hawaiian or Pacific Islander',
  WHITE = 'White',
  OTHER = 'Other',
}

/**
 * Citizenship status categories
 * Used for determining eligibility and requirements
 */
export enum Citizenship {
  US_CITIZEN = 'US Citizen',
  PERMANENT_RESIDENT = 'Permanent Resident',
  FOREIGN_STUDENT = 'Foreign Student',
}

/**
 * University of Miami colleges and schools
 * Used for tracking student academic affiliations
 */
export enum College {
  ARTS_AND_SCIENCES = 'College of Arts and Sciences',
  ARCHITECTURE = 'School of Architecture',
  BUSINESS = 'Miami Herbert Business School',
  COMMUNICATION = 'School of Communication',
  EDUCATION = 'School of Education & Human Development',
  ENGINEERING = 'College of Engineering',
  LAW = 'School of Law',
  MARINE_SCIENCE = 'Rosenstiel School of Marine, Atmospheric, and Earth Science',
  MEDICINE = 'Miller School of Medicine',
  MUSIC = 'Frost School of Music',
  NURSING = 'School of Nursing and Health Studies',
  GRAD = 'The Graduate School',
}

/**
 * Weekly time commitment ranges in hours
 * Used for project availability requirements
 */
export enum WeeklyAvailability {
  ZERO_TO_FIVE = '0-5',
  SIX_TO_EIGHT = '6-8',
  NINE_TO_ELEVEN = '9-11',
  TWELVE_PLUS = '12+',
}

/**
 * Project duration in semesters
 * Used for indicating expected project length
 */
export enum ProjectLength {
  ONE = '1',
  TWO = '2',
  THREE = '3',
  FOUR_PLUS = '4+',
}

/**
 * Student academic standing categories
 * Used for eligibility and filtering
 */
export enum AcademicStanding {
  FRESHMAN = 'freshman',
  SOPHOMORE = 'sophomore',
  JUNIOR = 'junior',
  SENIOR = 'senior',
  GRAD = 'graduate',
}
