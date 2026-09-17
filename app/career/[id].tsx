import { Stack, router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Badge, Card, EmptyState, SectionTitle } from '@/components/ui';
import { FavouriteButton } from '@/components/FavouriteButton';
import { findCareer, findQualification, findSubject } from '@/data';
import { colors, spacing, typography } from '@/theme';

const DEMAND_COLORS = { High: colors.success, Medium: colors.info, Low: colors.textMuted };

/** Career (occupation) detail — the deepest node of the Careers directory. */
export default function CareerDetail() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const career = id ? findCareer(id) : undefined;

  if (!career) {
    return <EmptyState message={t('explore.noResults')} />;
  }

  const salary = career.salaryBand
    ? `R${career.salaryBand.min.toLocaleString()} – R${career.salaryBand.max.toLocaleString()}`
    : '—';

  return (
    <>
      <Stack.Screen
        options={{ title: career.title, headerRight: () => <FavouriteButton kind="careers" id={career.id} /> }}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.summary}>{career.summary}</Text>
        <View style={styles.badges}>
          <Badge label={`${t('explore.outlook')}: ${career.demandOutlook}`} color={DEMAND_COLORS[career.demandOutlook]} />
          {career.ofoCode && <Badge label={`OFO ${career.ofoCode}`} color={colors.textMuted} />}
        </View>

        <Card style={styles.infoCard}>
          <Text style={styles.infoLabel}>{t('explore.salary')}</Text>
          <Text style={styles.infoValue}>{salary}</Text>
        </Card>

        <Text style={styles.body}>{career.description}</Text>

        <SectionTitle>{t('explore.recommendedSubjects')}</SectionTitle>
        <View style={styles.chips}>
          {career.recommendedSubjectIds.map((sid) => {
            const s = findSubject(sid);
            return s ? (
              <View key={sid} style={styles.pill}>
                <Text style={styles.pillText}>{s.name}</Text>
              </View>
            ) : null;
          })}
        </View>

        <SectionTitle>{t('explore.relatedQualifications')}</SectionTitle>
        {career.relatedQualificationIds.map((qid) => {
          const q = findQualification(qid);
          return q ? (
            <Card key={qid} style={styles.link} onPress={() => router.push(`/qualification/${qid}`)}>
              <Text style={styles.linkTitle}>{q.title}</Text>
              <Text style={styles.linkSub}>
                NQF {q.nqfLevel} · {q.type}
              </Text>
            </Card>
          ) : null;
        })}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  summary: { ...typography.h3, marginBottom: spacing.sm },
  badges: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md, flexWrap: 'wrap' },
  infoCard: { backgroundColor: colors.surface, marginBottom: spacing.md },
  infoLabel: { ...typography.caption },
  infoValue: { ...typography.h3, color: colors.primary },
  body: { ...typography.body, lineHeight: 24, marginBottom: spacing.lg },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  pill: {
    backgroundColor: colors.surfaceAlt,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 999,
  },
  pillText: { ...typography.label, fontSize: 13 },
  link: { marginBottom: spacing.sm, backgroundColor: colors.surface },
  linkTitle: { ...typography.label, fontSize: 15 },
  linkSub: { ...typography.caption, marginTop: 2 },
});
