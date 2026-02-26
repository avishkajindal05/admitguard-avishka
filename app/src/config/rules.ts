import { CandidateData } from '../types';

export interface ValidationRule {
  field: keyof CandidateData;
  type: 'strict' | 'soft';
  validation: string[];
  errorMessage?: string;
  warningMessage?: string;
  exceptionAllowed?: boolean;
  rationaleMinLength?: number;
  rationaleKeywords?: string[];
}

export interface RulesConfig {
  rules: ValidationRule[];
}

export const rulesConfig: RulesConfig = {
  rules: [
    {
      field: 'fullName',
      type: 'strict',
      validation: ['required', 'minLength:2', 'noNumbers'],
      errorMessage: 'Name must be at least 2 characters with no numbers'
    },
    {
      field: 'email',
      type: 'strict',
      validation: ['required', 'email'],
      errorMessage: 'Enter a valid email address'
    },
    {
      field: 'phone',
      type: 'strict',
      validation: ['required', 'phone:india'],
      errorMessage: 'Phone number must be 10 digits and start with 6-9'
    },
    {
      field: 'dob',
      type: 'soft',
      validation: ['ageRange:18-35'],
      warningMessage: 'Candidate age must be between 18-35',
      exceptionAllowed: true,
      rationaleMinLength: 30,
      rationaleKeywords: ['approved by', 'special case', 'documentation pending', 'waiver granted']
    },
    {
      field: 'highestQualification',
      type: 'strict',
      validation: ['required'],
      errorMessage: 'Please select a qualification'
    },
    {
      field: 'graduationYear',
      type: 'soft',
      validation: ['range:2015-2026'],
      warningMessage: 'Graduation year must be between 2015 and 2026',
      exceptionAllowed: true,
      rationaleMinLength: 30,
      rationaleKeywords: ['approved by', 'special case', 'documentation pending', 'waiver granted']
    },
    {
      field: 'percentageOrCgpa',
      type: 'soft',
      validation: ['modeAware:scoreType=percentage:minValue:60|cgpa:cgpaMin:6.0'],
      warningMessage: 'Academic score is below recommended threshold',
      exceptionAllowed: true,
      rationaleMinLength: 30,
      rationaleKeywords: ['approved by', 'special case', 'documentation pending', 'waiver granted']
    },
    {
      field: 'screeningScore',
      type: 'soft',
      validation: ['scoreMin:40'],
      warningMessage: 'Screening score must be ≥ 40',
      exceptionAllowed: true,
      rationaleMinLength: 30,
      rationaleKeywords: ['approved by', 'special case', 'documentation pending', 'waiver granted']
    },
    {
      field: 'interviewStatus',
      type: 'strict',
      validation: ['required'],
      errorMessage: 'Please select an interview status'
    },
    {
      field: 'aadhaarNumber',
      type: 'strict',
      validation: ['required', 'aadhaar:12digits'],
      errorMessage: 'Aadhaar must be exactly 12 digits with no letters'
    },
    {
      field: 'offerLetterSent',
      type: 'strict',
      validation: ['allowedIfYes:interviewStatus=Cleared|Waitlisted'],
      errorMessage: "Offer letter can only be marked as 'Yes' if the interview status is Cleared or Waitlisted"
    }
  ]
};
