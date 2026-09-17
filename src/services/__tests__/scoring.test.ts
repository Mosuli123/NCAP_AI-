import { jobFitQuestions } from '@/data/questionnaires';
import { scoreQuestionnaire, suggestCareers } from '@/services/scoring';
import type { RiasecCode } from '@/types';

describe('scoreQuestionnaire', () => {
  it('tallies scores per RIASEC code from answers', () => {
    // Agree (2) to every Realistic item, disagree (0) to the rest.
    const answers: Record<string, number> = {};
    jobFitQuestions.forEach((q) => {
      answers[q.id] = q.code === 'R' ? 2 : 0;
    });

    const result = scoreQuestionnaire('jobfit', jobFitQuestions, answers);

    expect(result.type).toBe('jobfit');
    expect(result.scores.R).toBeGreaterThan(0);
    expect(result.topCodes[0]).toBe('R');
    expect(result.suggestedCareerIds.length).toBeGreaterThan(0);
  });

  it('produces three top codes ordered by score', () => {
    const answers: Record<string, number> = {};
    jobFitQuestions.forEach((q, i) => {
      answers[q.id] = i % 2 === 0 ? 2 : 1;
    });
    const result = scoreQuestionnaire('jobfit', jobFitQuestions, answers);
    expect(result.topCodes).toHaveLength(3);
    for (let i = 1; i < result.topCodes.length; i++) {
      const prev = result.scores[result.topCodes[i - 1]];
      const cur = result.scores[result.topCodes[i]];
      expect(prev).toBeGreaterThanOrEqual(cur);
    }
  });

  it('handles unanswered questions as zero', () => {
    const result = scoreQuestionnaire('careerchoice', jobFitQuestions, {});
    const total = Object.values(result.scores).reduce((a, b) => a + b, 0);
    expect(total).toBe(0);
  });
});

describe('suggestCareers', () => {
  it('ranks social careers highest for a strong Social profile', () => {
    const scores: Record<RiasecCode, number> = { R: 0, I: 1, A: 0, S: 10, E: 0, C: 0 };
    const suggestions = suggestCareers(scores, 3);
    expect(suggestions.length).toBeGreaterThan(0);
    // At least one of the top suggestions should be a Social-coded career.
    expect(suggestions.some((c) => c.interestCodes.includes('S'))).toBe(true);
  });

  it('returns no more than the requested limit', () => {
    const scores: Record<RiasecCode, number> = { R: 3, I: 3, A: 3, S: 3, E: 3, C: 3 };
    expect(suggestCareers(scores, 4).length).toBeLessThanOrEqual(4);
  });
});
