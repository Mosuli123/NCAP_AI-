import type { Subject } from '@/types';

/**
 * Seed set of South African school subjects, aligned with the NCAP
 * Subject Chooser. Bundled with the app so the Subject Chooser works fully
 * offline. In production these would be synced from the NCAP API.
 */
export const subjects: Subject[] = [
  {
    id: 'subj-english',
    name: 'English Home Language',
    category: 'Languages',
    description: 'Compulsory language of learning; supports communication-heavy careers.',
    relatedCareerIds: ['career-teacher', 'career-lawyer', 'career-journalist'],
  },
  {
    id: 'subj-maths',
    name: 'Mathematics',
    category: 'Compulsory',
    description: 'Gateway subject for engineering, science, finance and computing.',
    relatedCareerIds: ['career-engineer', 'career-datascientist', 'career-accountant', 'career-doctor'],
  },
  {
    id: 'subj-mathslit',
    name: 'Mathematical Literacy',
    category: 'Compulsory',
    description: 'Practical numeracy for everyday and many service careers.',
    relatedCareerIds: ['career-nurse', 'career-socialworker'],
  },
  {
    id: 'subj-physical-science',
    name: 'Physical Sciences',
    category: 'Sciences',
    description: 'Physics and chemistry; essential for health and engineering pathways.',
    relatedCareerIds: ['career-engineer', 'career-doctor', 'career-pharmacist'],
  },
  {
    id: 'subj-life-science',
    name: 'Life Sciences',
    category: 'Sciences',
    description: 'Biology foundation for health, agriculture and environmental careers.',
    relatedCareerIds: ['career-doctor', 'career-nurse', 'career-agri'],
  },
  {
    id: 'subj-accounting',
    name: 'Accounting',
    category: 'Commerce',
    description: 'Financial recording and reporting; supports business careers.',
    relatedCareerIds: ['career-accountant', 'career-entrepreneur'],
  },
  {
    id: 'subj-business',
    name: 'Business Studies',
    category: 'Commerce',
    description: 'Enterprise, management and entrepreneurship fundamentals.',
    relatedCareerIds: ['career-entrepreneur', 'career-accountant'],
  },
  {
    id: 'subj-economics',
    name: 'Economics',
    category: 'Commerce',
    description: 'How markets and economies work; supports finance and policy careers.',
    relatedCareerIds: ['career-accountant', 'career-datascientist'],
  },
  {
    id: 'subj-geography',
    name: 'Geography',
    category: 'Humanities',
    description: 'People, places and the environment; supports planning and agri careers.',
    relatedCareerIds: ['career-agri', 'career-socialworker'],
  },
  {
    id: 'subj-history',
    name: 'History',
    category: 'Humanities',
    description: 'Critical analysis of the past; supports law, education and media.',
    relatedCareerIds: ['career-lawyer', 'career-teacher', 'career-journalist'],
  },
  {
    id: 'subj-cat',
    name: 'Computer Applications Technology',
    category: 'Technical',
    description: 'Practical computing and office productivity skills.',
    relatedCareerIds: ['career-datascientist', 'career-entrepreneur'],
  },
  {
    id: 'subj-it',
    name: 'Information Technology',
    category: 'Technical',
    description: 'Programming and systems; direct pathway into software careers.',
    relatedCareerIds: ['career-datascientist', 'career-engineer'],
  },
  {
    id: 'subj-visual-arts',
    name: 'Visual Arts',
    category: 'Arts',
    description: 'Creative and design skills for the cultural and creative economy.',
    relatedCareerIds: ['career-journalist'],
  },
];
