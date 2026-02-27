import { HighestQualification, InterviewStatus } from './types';

export const QUALIFICATIONS: HighestQualification[] = [
  'B.Tech', 'B.E.', 'B.Sc', 'BCA', 'M.Tech', 'M.Sc', 'MCA', 'MBA'
];

export const INTERVIEW_STATUSES: InterviewStatus[] = [
  'Cleared', 'Waitlisted', 'Rejected'
];

export const FIELD_CONFIG = {
  fullName: { label: 'Full Name', type: 'text', ruleKey: 'fullName', strict: true },
  email: { label: 'Email', type: 'text', ruleKey: 'email', strict: true },
  phone: { label: 'Phone', type: 'text', ruleKey: 'phone', strict: true, placeholder: '9876543210' },
  dob: { label: 'Date of Birth', type: 'date', ruleKey: 'dob', strict: false },
  highestQualification: { label: 'Highest Qualification', type: 'select', ruleKey: 'highestQualification', strict: true, options: QUALIFICATIONS },
  graduationYear: { label: 'Graduation Year', type: 'number', ruleKey: 'graduationYear', strict: false, min: 2015, max: 2025 },
  percentage_cgpa: { label: 'Percentage / CGPA', type: 'number', ruleKey: 'percentage_cgpa', strict: false },
  screeningScore: { label: 'Screening Test Score', type: 'number', ruleKey: 'screeningScore', strict: false, min: 0, max: 100 },
  interviewStatus: { label: 'Interview Status', type: 'select', ruleKey: 'interviewStatus', strict: true, options: INTERVIEW_STATUSES },
  aadhaarNumber: { label: 'Aadhaar Number', type: 'text', ruleKey: 'aadhaarNumber', strict: true, placeholder: '123456789012' },
  offerLetterSent: { label: 'Offer Letter Sent', type: 'toggle', ruleKey: 'offerLetterSent', strict: true },
};
