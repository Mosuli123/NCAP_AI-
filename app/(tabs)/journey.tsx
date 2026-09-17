import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button, Card, Chip, EmptyState, SectionTitle } from '@/components/ui';
import { findCareer, findProvider, findQualification, findSubject } from '@/data';
import { RIASEC_LABELS } from '@/services/scoring';
import { useProfile } from '@/store/ProfileContext';
import { colors, radius, spacing, typography } from '@/theme';

/**
 * "My Journey" — the personalised profile view. It visualises progress through
 * milestones, lists saved assessment results, favourites across all three
 * directories, and chosen subjects, tying the whole experience together.
 */
export default function JourneyScreen() {
  const { t } = useTranslation();
  const { profile } = useProfile();

  const completed = profile.journey.filter((m) => m.completedAt).length;
  const total = profile.journey.length;
  const pct = Math.round((completed / total) * 100);

  const favCount =
    profile.favourites.careers.length +
    profile.favourites.qualifications.length +
    profile.favourites.providers.length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Progress */}
      <Card style={styles.progressCard}>
        <Text style={styles.progressLabel}>{t('journey.progress')}</Text>
        <View style={styles.barTrack}>
          <View style={[styles.barFill, { width: `${pct}%` }]} />
        </View>
        <Text style={styles.progressPct}>
          {completed}/{total} · {pct}%
        </Text>
      </Card>

      {/* Milestones */}
      <SectionTitle>{t('journey.milestones')}</SectionTitle>
      {profile.journey.map((m) => (
        <View key={m.key} style={styles.milestone}>
          <Text style={[styles.check, m.completedAt && styles.checkDone]}>{m.completedAt ? '✓' : '○'}</Text>
          <Text style={[styles.milestoneLabel, m.completedAt && styles.milestoneDone]}>{m.label}</Text>
        </View>
      ))}

      {/* Assessment results */}
      <SectionTitle>{t('journey.results')}</SectionTitle>
      {profile.results.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Text style={styles.emptyText}>{t('journey.noResults')}</Text>
          <View style={{ height: spacing.sm }} />
          <Button title={t('journey.takeAssessment')} variant="accent" onPress={() => router.push('/(tabs)/assess')} />
        </Card>
      ) : (
        profile.results.map((r) => (
          <Card key={r.id} style={styles.resultCard}>
            <Text style={styles.resultType}>
              {r.type === 'jobfit' ? t('quiz.jobFitTitle') : t('quiz.careerChoiceTitle')}
            </Text>
            <Text style={styles.resultDate}>
              {t('journey.completedOn')} {new Date(r.completedAt).toLocaleDateString()}
            </Text>
            <View style={styles.chips}>
              {r.topCodes.map((code) => (
                <Chip key={code} label={RIASEC_LABELS[code].split(' ')[0]} selected />
              ))}
            </View>
          </Card>
        ))
      )}

      {/* Favourites */}
      <SectionTitle>{t('journey.favourites')}</SectionTitle>
      {favCount === 0 ? (
        <EmptyState message={t('journey.noFavourites')} />
      ) : (
        <>
          {profile.favourites.careers.map((id) => {
            const c = findCareer(id);
            return c ? (
              <Card key={id} style={styles.favRow} onPress={() => router.push(`/career/${id}`)}>
                <Text style={styles.favEmoji}>💼</Text>
                <Text style={styles.favTitle}>{c.title}</Text>
              </Card>
            ) : null;
          })}
          {profile.favourites.qualifications.map((id) => {
            const q = findQualification(id);
            return q ? (
              <Card key={id} style={styles.favRow} onPress={() => router.push(`/qualification/${id}`)}>
                <Text style={styles.favEmoji}>🎓</Text>
                <Text style={styles.favTitle}>{q.title}</Text>
              </Card>
            ) : null;
          })}
          {profile.favourites.providers.map((id) => {
            const p = findProvider(id);
            return p ? (
              <Card key={id} style={styles.favRow} onPress={() => router.push(`/provider/${id}`)}>
                <Text style={styles.favEmoji}>🏫</Text>
                <Text style={styles.favTitle}>{p.name}</Text>
              </Card>
            ) : null;
          })}
        </>
      )}

      {/* Chosen subjects */}
      {profile.chosenSubjectIds.length > 0 && (
        <>
          <SectionTitle>{t('journey.chosenSubjects')}</SectionTitle>
          <View style={styles.chips}>
            {profile.chosenSubjectIds.map((id) => {
              const s = findSubject(id);
              return s ? <Chip key={id} label={s.name} selected /> : null;
            })}
          </View>
        </>
      )}

      <View style={{ height: spacing.lg }} />
      <Button title={t('settings.title')} variant="outline" onPress={() => router.push('/settings')} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  progressCard: { marginBottom: spacing.lg, backgroundColor: colors.primary },
  progressLabel: { ...typography.caption, color: colors.textInverse, opacity: 0.9 },
  barTrack: { height: 14, borderRadius: radius.pill, backgroundColor: '#ffffff33', marginVertical: spacing.sm, overflow: 'hidden' },
  barFill: { height: 14, borderRadius: radius.pill, backgroundColor: colors.accent },
  progressPct: { ...typography.label, color: colors.textInverse },
  milestone: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm },
  check: { fontSize: 20, width: 30, color: colors.textMuted },
  checkDone: { color: colors.success },
  milestoneLabel: { ...typography.body },
  milestoneDone: { color: colors.textMuted, textDecorationLine: 'line-through' },
  emptyCard: { backgroundColor: colors.surface },
  emptyText: { ...typography.bodyMuted },
  resultCard: { marginBottom: spacing.sm },
  resultType: { ...typography.label, fontSize: 15 },
  resultDate: { ...typography.caption, marginTop: 2 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.sm },
  favRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm, gap: spacing.sm },
  favEmoji: { fontSize: 22 },
  favTitle: { ...typography.label, fontSize: 15, flex: 1 },
});
