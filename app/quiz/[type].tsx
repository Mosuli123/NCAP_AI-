import { Stack, router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button, Card, EmptyState } from '@/components/ui';
import { FavouriteButton } from '@/components/FavouriteButton';
import { careerChoiceQuestions, jobFitQuestions, likertOptions } from '@/data';
import { findCareer } from '@/data';
import { RIASEC_DESCRIPTIONS, RIASEC_LABELS, scoreQuestionnaire } from '@/services/scoring';
import { useProfile } from '@/store/ProfileContext';
import { colors, radius, spacing, typography } from '@/theme';
import type { QuestionnaireResult, RiasecCode } from '@/types';

/**
 * Unified questionnaire screen for both Job Fit and Career Choice.
 * Presents one question at a time (large, low-literacy-friendly Likert
 * buttons), then computes a personalised result and matching careers.
 */
export default function QuizScreen() {
  const { t } = useTranslation();
  const { type } = useLocalSearchParams<{ type: string }>();
  const { addResult } = useProfile();

  const isJobFit = type === 'jobfit';
  const questions = isJobFit ? jobFitQuestions : careerChoiceQuestions;
  const title = isJobFit ? t('quiz.jobFitTitle') : t('quiz.careerChoiceTitle');

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<QuestionnaireResult | null>(null);
  const [saved, setSaved] = useState(false);

  const answer = (value: number) => {
    const q = questions[index];
    const next = { ...answers, [q.id]: value };
    setAnswers(next);
    if (index < questions.length - 1) {
      setIndex(index + 1);
    } else {
      const r = scoreQuestionnaire(isJobFit ? 'jobfit' : 'careerchoice', questions, next);
      setResult(r);
    }
  };

  const restart = () => {
    setAnswers({});
    setIndex(0);
    setResult(null);
    setSaved(false);
  };

  const save = () => {
    if (result && !saved) {
      addResult(result);
      setSaved(true);
    }
  };

  if (result) {
    return <Results result={result} title={title} onRetake={restart} onSave={save} saved={saved} />;
  }

  const q = questions[index];
  const progress = (index + 1) / questions.length;

  return (
    <>
      <Stack.Screen options={{ title }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {index === 0 && <Text style={styles.intro}>{t('quiz.intro')}</Text>}

        <View style={styles.progressTrack} accessibilityLabel={`${t('quiz.question')} ${index + 1} ${t('quiz.of')} ${questions.length}`}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
        <Text style={styles.counter}>
          {t('quiz.question')} {index + 1} {t('quiz.of')} {questions.length}
        </Text>

        <Card style={styles.questionCard}>
          <Text style={styles.questionText}>{q.text}</Text>
        </Card>

        <View style={styles.options}>
          {likertOptions.map((opt) => (
            <Button
              key={opt.value}
              title={t(opt.labelKey)}
              variant={opt.value === 2 ? 'primary' : opt.value === 1 ? 'outline' : 'ghost'}
              onPress={() => answer(opt.value)}
            />
          ))}
        </View>

        {index > 0 && (
          <View style={{ marginTop: spacing.md }}>
            <Button title={t('common.back')} variant="ghost" onPress={() => setIndex(index - 1)} />
          </View>
        )}
      </ScrollView>
    </>
  );
}

function Results({
  result,
  title,
  onRetake,
  onSave,
  saved,
}: {
  result: QuestionnaireResult;
  title: string;
  onRetake: () => void;
  onSave: () => void;
  saved: boolean;
}) {
  const { t } = useTranslation();
  const maxScore = Math.max(...Object.values(result.scores), 1);

  return (
    <>
      <Stack.Screen options={{ title }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.resultsHeading}>{t('quiz.yourInterests')}</Text>
        {result.topCodes.map((code) => (
          <InterestBar key={code} code={code} value={result.scores[code]} max={maxScore} />
        ))}

        <Text style={[styles.resultsHeading, { marginTop: spacing.lg }]}>{t('quiz.suggestedCareers')}</Text>
        {result.suggestedCareerIds.length === 0 ? (
          <EmptyState message={t('explore.noResults')} />
        ) : (
          result.suggestedCareerIds.map((id) => {
            const c = findCareer(id);
            if (!c) return null;
            return (
              <Card
                key={id}
                style={styles.careerRow}
                onPress={() => router.push(`/career/${id}`)}
                accessibilityLabel={c.title}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.careerTitle}>{c.title}</Text>
                  <Text style={styles.careerSummary} numberOfLines={2}>
                    {c.summary}
                  </Text>
                </View>
                <FavouriteButton kind="careers" id={id} />
              </Card>
            );
          })
        )}

        <View style={styles.actions}>
          <Button title={saved ? t('common.saved') : t('quiz.saveResults')} variant="accent" disabled={saved} onPress={onSave} />
          <View style={{ height: spacing.sm }} />
          <Button title={t('quiz.retake')} variant="outline" onPress={onRetake} />
          <View style={{ height: spacing.sm }} />
          <Button title={t('journey.title')} variant="ghost" onPress={() => router.push('/(tabs)/journey')} />
        </View>
      </ScrollView>
    </>
  );
}

function InterestBar({ code, value, max }: { code: RiasecCode; value: number; max: number }) {
  const pct = Math.round((value / max) * 100);
  return (
    <View style={styles.interest}>
      <View style={styles.interestHeader}>
        <Text style={styles.interestLabel}>{RIASEC_LABELS[code]}</Text>
      </View>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: colors.riasec[code] }]} />
      </View>
      <Text style={styles.interestDesc}>{RIASEC_DESCRIPTIONS[code]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  intro: { ...typography.bodyMuted, marginBottom: spacing.md },
  progressTrack: { height: 8, borderRadius: radius.pill, backgroundColor: colors.surfaceAlt, overflow: 'hidden' },
  progressFill: { height: 8, backgroundColor: colors.accent },
  counter: { ...typography.caption, marginTop: spacing.xs, marginBottom: spacing.md },
  questionCard: { minHeight: 120, justifyContent: 'center', marginBottom: spacing.lg },
  questionText: { ...typography.h3, textAlign: 'center', lineHeight: 28 },
  options: { gap: spacing.sm },
  resultsHeading: { ...typography.h2, marginBottom: spacing.md },
  interest: { marginBottom: spacing.md },
  interestHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  interestLabel: { ...typography.label, fontSize: 15 },
  barTrack: { height: 14, borderRadius: radius.pill, backgroundColor: colors.surfaceAlt, marginVertical: spacing.xs },
  barFill: { height: 14, borderRadius: radius.pill },
  interestDesc: { ...typography.caption },
  careerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  careerTitle: { ...typography.label, fontSize: 16 },
  careerSummary: { ...typography.caption, marginTop: 2 },
  actions: { marginTop: spacing.lg },
});
