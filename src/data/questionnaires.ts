import type { QuestionnaireItem } from '@/types';

/**
 * Job Fit questionnaire — a simplified, mobile-native RIASEC (Holland Code)
 * interest inventory. Each item maps to one interest category; the user rates
 * agreement and we tally scores to surface their top interests and matching
 * careers. This improves on the desktop NCAP questionnaire by being short,
 * swipeable and understandable at a low digital-literacy level.
 */
export const jobFitQuestions: QuestionnaireItem[] = [
  { id: 'jf-1', code: 'R', text: 'I enjoy working with my hands, tools or machines.' },
  { id: 'jf-2', code: 'R', text: 'I like fixing or building physical things.' },
  { id: 'jf-3', code: 'I', text: 'I like solving puzzles and figuring out how things work.' },
  { id: 'jf-4', code: 'I', text: 'I enjoy science, research and asking questions.' },
  { id: 'jf-5', code: 'A', text: 'I like to draw, write, design or make music.' },
  { id: 'jf-6', code: 'A', text: 'I prefer tasks that let me be creative and original.' },
  { id: 'jf-7', code: 'S', text: 'I enjoy helping, teaching or caring for other people.' },
  { id: 'jf-8', code: 'S', text: 'People often come to me for support or advice.' },
  { id: 'jf-9', code: 'E', text: 'I like leading a team and persuading others.' },
  { id: 'jf-10', code: 'E', text: 'I would enjoy starting or running my own business.' },
  { id: 'jf-11', code: 'C', text: 'I like organising information, records and schedules.' },
  { id: 'jf-12', code: 'C', text: 'I prefer clear rules and working with numbers or data.' },
];

/**
 * Career Choice questionnaire — focuses on work values and preferred
 * environments, complementing Job Fit. Same scoring model, different framing,
 * matching the two distinct NCAP self-assessments.
 */
export const careerChoiceQuestions: QuestionnaireItem[] = [
  { id: 'cc-1', code: 'S', text: 'Making a positive difference in my community matters to me.' },
  { id: 'cc-2', code: 'I', text: 'I want a career where I keep learning new things.' },
  { id: 'cc-3', code: 'E', text: 'I want opportunities to grow into leadership and earn well.' },
  { id: 'cc-4', code: 'R', text: 'I would rather work outdoors or on practical projects than at a desk.' },
  { id: 'cc-5', code: 'A', text: 'Expressing myself and being creative is important in my work.' },
  { id: 'cc-6', code: 'C', text: 'I like stability, structure and knowing what to expect at work.' },
  { id: 'cc-7', code: 'I', text: 'I enjoy analysing problems before deciding what to do.' },
  { id: 'cc-8', code: 'S', text: 'Working closely with and understanding people energises me.' },
  { id: 'cc-9', code: 'E', text: 'I am comfortable taking risks to reach a goal.' },
  { id: 'cc-10', code: 'R', text: 'I feel satisfied when I can see the physical result of my work.' },
];

/** Likert response options shared by both questionnaires. */
export const likertOptions = [
  { value: 0, labelKey: 'quiz.disagree' },
  { value: 1, labelKey: 'quiz.neutral' },
  { value: 2, labelKey: 'quiz.agree' },
] as const;
