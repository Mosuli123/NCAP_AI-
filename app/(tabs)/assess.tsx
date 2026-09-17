import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button, Card, Chip, EmptyState, SectionTitle } from '@/components/ui';
import { careers, findSubject } from '@/data';
import { useProfile } from '@/store/ProfileContext';
import { colors, spacing, typography } from '@/theme';

/**
 * "Assess" hub combines the Subject Chooser (interactive, career-first subject
 * selection) with entry points to the two questionnaires. The Subject Chooser
 * improves on NCAP by working backwards from a career of interest to the exact
 * subjects that unlock it, then letting the user save them to their journey.
 */
export default function AssessScreen() {
  const { t } = useTranslation();
  const { profile, setSubjects } = useProfile();
  const [selectedCareerId, setSelectedCareerId] = useState<string | null>(null);

  const selectedCareer = useMemo(
    () => careers.find((c) => c.id === selectedCareerId) ?? null,
    [selectedCareerId]
  );

  const recommended = selectedCareer
    ? selectedCareer.recommendedSubjectIds.map(findSubject).filter(Boolean)
    : [];

  const saveSubjects = () => {
    if (!selectedCareer) return;
    const merged = Array.from(new Set([...profile.chosenSubjectIds, ...selectedCareer.recommendedSubjectIds]));
    setSubjects(merged);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Questionnaire entry points */}
      <SectionTitle>{t('tabs.assess')}</SectionTitle>
      <Card style={styles.quizCard} onPress={() => router.push('/quiz/jobfit')}>
        <Text style={styles.quizEmoji}>🧩</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.quizTitle}>{t('home.jobFit')}</Text>
          <Text style={styles.quizDesc}>{t('home.jobFitDesc')}</Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </Card>
      <Card style={styles.quizCard} onPress={() => router.push('/quiz/careerchoice')}>
        <Text style={styles.quizEmoji}>💡</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.quizTitle}>{t('home.careerChoice')}</Text>
          <Text style={styles.quizDesc}>{t('home.careerChoiceDesc')}</Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </Card>

      {/* Subject Chooser */}
      <View style={styles.divider} />
      <SectionTitle>{t('subject.title')}</SectionTitle>
      <Text style={styles.intro}>{t('subject.intro')}</Text>

      <Text style={styles.pickLabel}>{t('subject.pickCareer')}</Text>
      <View style={styles.chips}>
        {careers.map((c) => (
          <Chip
            key={c.id}
            label={c.title}
            selected={c.id === selectedCareerId}
            onPress={() => setSelectedCareerId(c.id === selectedCareerId ? null : c.id)}
          />
        ))}
      </View>

      {selectedCareer && (
        <View style={styles.result}>
          <Text style={styles.resultCareer}>{selectedCareer.title}</Text>
          <SectionTitle>{t('subject.recommended')}</SectionTitle>
          {recommended.length === 0 ? (
            <EmptyState message={t('explore.noResults')} />
          ) : (
            recommended.map((s) =>
              s ? (
                <Card key={s.id} style={styles.subjectCard}>
                  <Text style={styles.subjectName}>{s.name}</Text>
                  <Text style={styles.subjectDesc}>{s.description}</Text>
                </Card>
              ) : null
            )
          )}
          <View style={{ height: spacing.md }} />
          <Button title={t('subject.saveSubjects')} variant="accent" onPress={saveSubjects} />
        </View>
      )}

      {profile.chosenSubjectIds.length > 0 && (
        <View style={styles.saved}>
          <SectionTitle>{t('journey.chosenSubjects')}</SectionTitle>
          <View style={styles.chips}>
            {profile.chosenSubjectIds.map((id) => {
              const s = findSubject(id);
              return s ? <Chip key={id} label={s.name} selected /> : null;
            })}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  quizCard: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  quizEmoji: { fontSize: 28, marginRight: spacing.md },
  quizTitle: { ...typography.label, fontSize: 16 },
  quizDesc: { ...typography.caption, marginTop: 2 },
  chevron: { fontSize: 28, color: colors.textMuted },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.lg },
  intro: { ...typography.bodyMuted, marginBottom: spacing.md },
  pickLabel: { ...typography.label, marginBottom: spacing.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  result: { marginTop: spacing.lg },
  resultCareer: { ...typography.h3, color: colors.primary, marginBottom: spacing.sm },
  subjectCard: { marginBottom: spacing.sm, backgroundColor: colors.surface },
  subjectName: { ...typography.label, fontSize: 15 },
  subjectDesc: { ...typography.caption, marginTop: 2 },
  saved: { marginTop: spacing.xl, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.lg },
});
