import { Stack, router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Badge, Card, EmptyState, SectionTitle } from '@/components/ui';
import { FavouriteButton } from '@/components/FavouriteButton';
import { findCareer, findProvider, findQualification } from '@/data';
import { colors, spacing, typography } from '@/theme';

/** Qualification detail — the "What to Study" directory node. */
export default function QualificationDetail() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const qual = id ? findQualification(id) : undefined;

  if (!qual) return <EmptyState message={t('explore.noResults')} />;

  return (
    <>
      <Stack.Screen
        options={{ title: qual.title, headerRight: () => <FavouriteButton kind="qualifications" id={qual.id} /> }}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.summary}>{qual.summary}</Text>
        <Card style={styles.infoCard}>
          <Badge label={`NQF ${qual.nqfLevel}`} color={colors.primary} />
          <Badge label={qual.type} color={colors.info} />
          <Badge label={`${Math.round(qual.durationMonths / 12)} yr`} color={colors.textMuted} />
        </Card>
        <Text style={styles.field}>{qual.field}</Text>

        <SectionTitle>{t('explore.offeredBy')}</SectionTitle>
        {qual.providerIds.map((pid) => {
          const p = findProvider(pid);
          return p ? (
            <Card key={pid} style={styles.link} onPress={() => router.push(`/provider/${pid}`)}>
              <Text style={styles.linkTitle}>{p.name}</Text>
              <Text style={styles.linkSub}>
                {p.city}, {p.province}
              </Text>
            </Card>
          ) : null;
        })}

        <SectionTitle>{t('explore.relatedCareers')}</SectionTitle>
        {qual.relatedCareerIds.map((cid) => {
          const c = findCareer(cid);
          return c ? (
            <Card key={cid} style={styles.link} onPress={() => router.push(`/career/${cid}`)}>
              <Text style={styles.linkTitle}>{c.title}</Text>
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
  summary: { ...typography.h3, marginBottom: spacing.md },
  infoCard: { flexDirection: 'row', gap: spacing.sm, backgroundColor: colors.surface, flexWrap: 'wrap' },
  field: { ...typography.bodyMuted, marginVertical: spacing.md },
  link: { marginBottom: spacing.sm, backgroundColor: colors.surface },
  linkTitle: { ...typography.label, fontSize: 15 },
  linkSub: { ...typography.caption, marginTop: 2 },
});
