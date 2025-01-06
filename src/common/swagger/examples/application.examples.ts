export const createApplicationExamples = {
  strong: {
    summary: 'Strong Application',
    description: 'Example of a strong student application',
    value: {
      application: JSON.stringify(
        {
          studentInfo: {
            name: {
              firstName: 'Alice',
              lastName: 'Johnson',
            },
            cNumber: 'C12345678',
            email: 'alice.johnson@miami.edu',
            phoneNumber: '305-123-4567',
            racialEthnicGroups: ['WHITE'],
            citizenship: 'US_CITIZEN',
            academicStanding: 'JUNIOR',
            graduationDate: '2025-05-15',
            major1College: 'ARTS_AND_SCIENCES',
            major1: 'Computer Science',
            hasAdditionalMajor: false,
            isPreHealth: false,
            gpa: 3.95,
          },
          availability: {
            mondayAvailability: '9AM-5PM',
            tuesdayAvailability: '9AM-5PM',
            wednesdayAvailability: '9AM-5PM',
            thursdayAvailability: '9AM-5PM',
            fridayAvailability: '9AM-5PM',
            weeklyHours: 'TWELVE_PLUS',
            desiredProjectLength: 'FOUR_PLUS',
          },
          additionalInfo: {
            hasPrevResearchExperience: false,
            researchInterestDescription: 'Interest in molecular biology research',
            hasFederalWorkStudy: false,
            speaksOtherLanguages: false,
            comfortableWithAnimals: true,
          },
        },
        null,
        2,
      ),
    },
  },
  basic: {
    summary: 'Basic Application',
    description: 'Example of a basic student application',
    value: {
      application: JSON.stringify(
        {
          studentInfo: {
            name: {
              firstName: 'Bob',
              lastName: 'Smith',
            },
            cNumber: 'C87654321',
            email: 'bob.smith@miami.edu',
            phoneNumber: '305-987-6543',
            genderIdentity: 'Male',
            racialEthnicGroups: ['WHITE'],
            citizenship: 'US_CITIZEN',
            hasPostSecondaryTranscript: false,
            academicStanding: 'Sophomore',
            graduationDate: '2026-05-15',
            major1College: 'ARTS_AND_SCIENCES',
            major1: 'Biology',
            hasAdditionalMajor: false,
            isPreHealth: true,
            preHealthTrack: 'Pre-Med',
            gpa: 3.2,
          },
          researchExperience: {
            hasPreviousExperience: false,
            researchInterestCategory: 'Biology',
            researchInterestDescription: 'Interest in molecular biology research',
            educationalCareerGoals: 'Medical School',
            courseworkSkills: 'Biology, Chemistry, Lab Techniques',
          },
          cancerResearchInterest: {
            hasOncologyInterest: true,
            scccInterest: 'Interest in cancer biology',
          },
          availability: {
            mondayAvailability: '2PM-5PM',
            tuesdayAvailability: '2PM-5PM',
            wednesdayAvailability: '2PM-5PM',
            thursdayAvailability: '2PM-5PM',
            fridayAvailability: '2PM-5PM',
            weeklyHours: 'SIX_TO_EIGHT',
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
  },
};

export const updateApplicationStatusExamples = {
  accept: {
    summary: 'Accept Application',
    value: {
      status: 'ACCEPTED',
    },
  },
  reject: {
    summary: 'Reject Application',
    value: {
      status: 'REJECTED',
    },
  },
};
