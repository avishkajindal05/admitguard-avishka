export type View = 'admission-form' | 'audit-log' | 'dashboard';

export type InterviewStatus = 'Cleared' | 'Waitlisted' | 'Rejected';

export type HighestQualification = 'B.Tech' | 'B.E.' | 'B.Sc' | 'BCA' | 'M.Tech' | 'M.Sc' | 'MCA' | 'MBA';

export interface CandidateData {
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  highestQualification: HighestQualification | '';
  graduationYear: string;
  percentageOrCgpa: string;
  scoreType: 'percentage' | 'cgpa';
  screeningScore: string;
  interviewStatus: InterviewStatus | '';
  aadhaarNumber: string;
  offerLetterSent: boolean;
}

export interface Exception {
  field: keyof CandidateData;
  rationale: string;
}

export interface Submission {
  id: string;
  timestamp: string;
  candidateData: CandidateData;
  exceptionCount: number;
  exceptions: Exception[];
  flagged: boolean;
}

export interface DashboardMetrics {
  totalSubmissions: number;
  totalExceptions: number;
  exceptionRate: number;
  flaggedEntries: number;
}
