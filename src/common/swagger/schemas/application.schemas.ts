import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export const ApplicationSchemas = {
  Create: {
    schema: {
      type: 'object',
      required: ['application', 'resume'],
      properties: {
        application: {
          type: 'string',
          format: 'json',
          description: 'Stringified JSON containing application details',
          example: JSON.stringify(
            {
              studentInfo: {
                name: {
                  firstName: 'John',
                  lastName: 'Smith',
                },
                cNumber: 'C12345678',
                email: 'john.smith@miami.edu',
                phoneNumber: '305-123-4567',
                genderIdentity: 'Male',
                racialEthnicGroups: ['WHITE'],
                citizenship: 'US_CITIZEN',
                hasPostSecondaryTranscript: false,
                academicStanding: 'Junior',
                graduationDate: '2025-05-15',
                major1College: 'ARTS_AND_SCIENCES',
                major1: 'Computer Science',
                hasAdditionalMajor: false,
                isPreHealth: false,
                gpa: 3.8,
              },
              researchExperience: {
                hasPreviousExperience: false,
                researchInterestCategory: 'Computer Science',
                researchInterestDescription: 'Interested in AI/ML research',
                educationalCareerGoals: 'Planning to pursue PhD',
                courseworkSkills: 'Python, Machine Learning, Statistics',
              },
              cancerResearchInterest: {
                hasOncologyInterest: false,
              },
              availability: {
                mondayAvailability: '9AM-5PM',
                tuesdayAvailability: '9AM-5PM',
                wednesdayAvailability: '9AM-5PM',
                thursdayAvailability: '9AM-5PM',
                fridayAvailability: '9AM-5PM',
                weeklyHours: 'NINE_TO_ELEVEN',
                desiredProjectLength: 'TWO',
              },
              additionalInfo: {
                hasFederalWorkStudy: false,
                speaksOtherLanguages: false,
                comfortableWithAnimals: true,
                howHeardAboutProgram: 'Department Website',
              },
            },
            null,
            2,
          ),
        },
        resume: {
          type: 'string',
          format: 'binary',
          description: 'Resume file (Must be PDF, DOC, or DOCX format, maximum size: 5MB)',
        },
      },
    },
  },
  Response: {
    schema: {
      type: 'object',
      required: [
        'id',
        'project',
        'studentInfo',
        'researchExperience',
        'cancerResearchInterest',
        'availability',
        'additionalInfo',
        'resumeFile',
        'status',
        'createdAt',
        'updatedAt',
      ],
      properties: {
        id: { type: 'string', example: '507f1f77bcf86cd799439011' },
        project: { type: 'string', example: '507f1f77bcf86cd799439012' },
        studentInfo: {
          type: 'object',
          properties: {
            name: {
              type: 'object',
              properties: {
                firstName: { type: 'string' },
                lastName: { type: 'string' },
              },
            },
            cNumber: { type: 'string' },
            email: { type: 'string', format: 'email' },
            phoneNumber: { type: 'string' },
            genderIdentity: { type: 'string' },
            racialEthnicGroups: { type: 'array', items: { type: 'string' } },
            citizenship: {
              type: 'string',
              enum: ['US_CITIZEN', 'PERMANENT_RESIDENT', 'FOREIGN_STUDENT'],
            },
            hasPostSecondaryTranscript: { type: 'boolean' },
            academicStanding: { type: 'string' },
            graduationDate: { type: 'string', format: 'date' },
            major1College: { type: 'string' },
            major1: { type: 'string' },
            hasAdditionalMajor: { type: 'boolean' },
            major2College: { type: 'string' },
            major2: { type: 'string' },
            isPreHealth: { type: 'boolean' },
            preHealthTrack: { type: 'string' },
            gpa: { type: 'number', minimum: 0, maximum: 4.0 },
          },
        },
        researchExperience: {
          type: 'object',
          properties: {
            hasPreviousExperience: { type: 'boolean' },
            experienceDescription: { type: 'string' },
            researchInterestCategory: { type: 'string' },
            researchInterestDescription: { type: 'string' },
            educationalCareerGoals: { type: 'string' },
            courseworkSkills: { type: 'string' },
          },
        },
        cancerResearchInterest: {
          type: 'object',
          properties: {
            hasOncologyInterest: { type: 'boolean' },
            scccInterest: { type: 'string' },
          },
        },
        availability: {
          type: 'object',
          properties: {
            mondayAvailability: { type: 'string' },
            tuesdayAvailability: { type: 'string' },
            wednesdayAvailability: { type: 'string' },
            thursdayAvailability: { type: 'string' },
            fridayAvailability: { type: 'string' },
            weeklyHours: {
              type: 'string',
              enum: ['ZERO_TO_FIVE', 'SIX_TO_EIGHT', 'NINE_TO_ELEVEN', 'TWELVE_PLUS'],
            },
            desiredProjectLength: { type: 'string', enum: ['ONE', 'TWO', 'THREE', 'FOUR_PLUS'] },
          },
        },
        additionalInfo: {
          type: 'object',
          properties: {
            hasFederalWorkStudy: { type: 'boolean' },
            speaksOtherLanguages: { type: 'boolean' },
            additionalLanguages: { type: 'string' },
            comfortableWithAnimals: { type: 'boolean' },
            howHeardAboutProgram: { type: 'string' },
          },
        },
        resumeFile: { type: 'string' },
        status: {
          type: 'string',
          enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN'],
        },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  } as SchemaObject,
};
