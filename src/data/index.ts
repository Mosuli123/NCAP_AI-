/**
 * Central access point for bundled seed data. Screens import from here so that
 * swapping the local dataset for a live NCAP API response (via the api layer)
 * only touches one place.
 */
export { subjects } from './subjects';
export { careers } from './careers';
export { qualifications } from './qualifications';
export { providers } from './providers';
export { adviceContacts, careerEvents } from './advice';
export { jobFitQuestions, careerChoiceQuestions, likertOptions } from './questionnaires';

import { careers } from './careers';
import { qualifications } from './qualifications';
import { providers } from './providers';
import { subjects } from './subjects';

export const findCareer = (id: string) => careers.find((c) => c.id === id);
export const findQualification = (id: string) => qualifications.find((q) => q.id === id);
export const findProvider = (id: string) => providers.find((p) => p.id === id);
export const findSubject = (id: string) => subjects.find((s) => s.id === id);
