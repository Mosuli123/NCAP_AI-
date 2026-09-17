import { careers } from '@/data/careers';
import type { Career, QuestionnaireItem, QuestionnaireResult, RiasecCode } from '@/types';

const ALL_CODES: RiasecCode[] = ['R', 'I', 'A', 'S', 'E', 'C'];

export const RIASEC_LABELS: Record<RiasecCode, string> = {
  R: 'Realistic (Doers)',
  I: 'Investigative (Thinkers)',
  A: 'Artistic (Creators)',
  S: 'Social (Helpers)',
  E: 'Enterprising (Persuaders)',
  C: 'Conventional (Organisers)',
};

export const RIASEC_DESCRIPTIONS: Record<RiasecCode, string> = {
  R: 'You enjoy practical, hands-on work with tools, machines, plants or animals.',
  I: 'You enjoy analysing, researching and solving complex problems.',
  A: 'You enjoy creative self-expression through art, design, writing or music.',
  S: 'You enjoy helping, teaching, supporting and working with people.',
  E: 'You enjoy leading, persuading, selling and taking initiative.',
  C: 'You enjoy organising, working with data and following clear procedures.',
};

function emptyScores(): Record<RiasecCode, number> {
  return { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
}

/**
 * Scores a questionnaire from the user's answers.
 * @param questions ordered questionnaire items
 * @param answers   map of questionId -> Likert value (0 disagree, 1 neutral, 2 agree)
 */
export function scoreQuestionnaire(
  type: QuestionnaireResult['type'],
  questions: QuestionnaireItem[],
  answers: Record<string, number>
): QuestionnaireResult {
  const scores = emptyScores();
  for (const q of questions) {
    const value = answers[q.id] ?? 0;
    scores[q.code] += value;
  }

  const topCodes = [...ALL_CODES]
    .sort((a, b) => scores[b] - scores[a])
    .slice(0, 3);

  const suggestedCareerIds = suggestCareers(scores).map((c) => c.id);

  return {
    id: `${type}-${Date.now()}`,
    type,
    completedAt: new Date().toISOString(),
    scores,
    topCodes,
    suggestedCareerIds,
  };
}

/**
 * Ranks careers by how well their interest codes align with the user's scores.
 * Each career's interest codes are weighted by position (primary interest
 * counts most), producing an intuitive, explainable match.
 */
export function suggestCareers(scores: Record<RiasecCode, number>, limit = 6): Career[] {
  const ranked = careers
    .map((career) => {
      let match = 0;
      career.interestCodes.forEach((code, idx) => {
        const weight = career.interestCodes.length - idx; // earlier codes weigh more
        match += (scores[code] ?? 0) * weight;
      });
      // Small nudge towards high-demand occupations for better guidance.
      const demandBonus = career.demandOutlook === 'High' ? 1.1 : career.demandOutlook === 'Medium' ? 1.0 : 0.95;
      return { career, match: match * demandBonus };
    })
    .filter((r) => r.match > 0)
    .sort((a, b) => b.match - a.match)
    .slice(0, limit)
    .map((r) => r.career);

  return ranked;
}

export const allCodes = ALL_CODES;
