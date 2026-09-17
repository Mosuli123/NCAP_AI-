/**
 * Core domain types for the Khetha NCAP app.
 * These mirror the National Career Advice Portal information architecture:
 * Subjects, Careers (occupations), Qualifications ("What to Study"),
 * Learning Providers ("Where to Study"), and self-assessment questionnaires.
 */

/** RIASEC (Holland Code) interest categories used by the Job Fit questionnaire. */
export type RiasecCode = 'R' | 'I' | 'A' | 'S' | 'E' | 'C';

export type NqfLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface Subject {
  id: string;
  name: string;
  category: 'Compulsory' | 'Sciences' | 'Commerce' | 'Humanities' | 'Languages' | 'Arts' | 'Technical';
  description: string;
  /** Careers this subject is commonly a gateway to. */
  relatedCareerIds: string[];
}

export interface Career {
  id: string;
  title: string;
  /** Organising Framework for Occupations (OFO) code — aligns with NCAP data. */
  ofoCode?: string;
  summary: string;
  description: string;
  interestCodes: RiasecCode[];
  /** Typical subjects that support this career at school level. */
  recommendedSubjectIds: string[];
  /** Qualifications that lead into this career. */
  relatedQualificationIds: string[];
  /** Rough salary band in ZAR per month, for guidance only. */
  salaryBand?: { min: number; max: number };
  demandOutlook: 'High' | 'Medium' | 'Low';
  tags: string[];
}

export interface Qualification {
  id: string;
  title: string;
  nqfLevel: NqfLevel;
  type: 'Certificate' | 'Diploma' | 'Degree' | 'Higher Certificate' | 'Occupational';
  field: string;
  durationMonths: number;
  summary: string;
  /** Providers that offer this qualification. */
  providerIds: string[];
  relatedCareerIds: string[];
}

export interface Provider {
  id: string;
  name: string;
  type: 'University' | 'TVET College' | 'University of Technology' | 'Private College' | 'SETA';
  province: Province;
  city: string;
  website?: string;
  phone?: string;
  email?: string;
  /** Whether the institution offers distance / online learning. */
  offersDistance: boolean;
  qualificationIds: string[];
}

export type Province =
  | 'Eastern Cape'
  | 'Free State'
  | 'Gauteng'
  | 'KwaZulu-Natal'
  | 'Limpopo'
  | 'Mpumalanga'
  | 'North West'
  | 'Northern Cape'
  | 'Western Cape';

/** A single question in a self-assessment questionnaire. */
export interface QuestionnaireItem {
  id: string;
  text: string;
  /** Which interest code answering "agree" contributes towards. */
  code: RiasecCode;
}

export interface QuestionnaireResult {
  id: string;
  type: 'jobfit' | 'careerchoice';
  completedAt: string; // ISO date
  /** Score per RIASEC code. */
  scores: Record<RiasecCode, number>;
  /** Top 3 codes, highest first. */
  topCodes: RiasecCode[];
  suggestedCareerIds: string[];
}

export interface AdviceContact {
  id: string;
  name: string;
  role: string;
  province?: Province;
  phone?: string;
  email?: string;
  whatsapp?: string;
  channel: 'Call Centre' | 'Practitioner' | 'Walk-in Centre' | 'Online';
}

export interface CareerEvent {
  id: string;
  title: string;
  date: string; // ISO date
  location: string;
  province: Province;
  description: string;
  virtual: boolean;
}

/** Persisted user profile — the heart of the "personalised career journey". */
export interface UserProfile {
  id: string;
  displayName?: string;
  grade?: number;
  province?: Province;
  language: SupportedLanguage;
  createdAt: string;
  consent: ConsentState;
  results: QuestionnaireResult[];
  /** IDs saved as favourites, keyed by entity type. */
  favourites: {
    careers: string[];
    qualifications: string[];
    providers: string[];
  };
  /** Subjects chosen via the Subject Chooser. */
  chosenSubjectIds: string[];
  /** Milestones for the journey tracker. */
  journey: JourneyMilestone[];
}

export interface ConsentState {
  dataProcessing: boolean; // POPIA-aligned consent to store profile
  notifications: boolean;
  analytics: boolean;
  updatedAt: string;
}

export interface JourneyMilestone {
  key: 'onboarded' | 'subjects_chosen' | 'jobfit_done' | 'careerchoice_done' | 'saved_career' | 'saved_provider';
  label: string;
  completedAt?: string;
}

export type SupportedLanguage = 'en' | 'zu' | 'af' | 'xh';
