import { Stack, router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Badge, Button, Card, EmptyState, SectionTitle } from '@/components/ui';
import { FavouriteButton } from '@/components/FavouriteButton';
import { findProvider, findQualification } from '@/data';
import { colors, spacing, typography } from '@/theme';

/** Learning provider detail — the "Where to Study" directory node. */
export default function ProviderDetail() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const provider = id ? findProvider(id) : undefined;

  if (!provider) return <EmptyState message={t('explore.noResults')} />;

  const open = (url: string) => Linking.openURL(url).catch(() => undefined);

  return (
    <>
      <Stack.Screen
        options={{ title: provider.name, headerRight: () => <FavouriteButton kind="providers" id={provider.id} /> }}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.badges}>
          <Badge label={provider.type} color={colors.primary} />
          <Badge label={`${provider.city}, ${provider.province}`} color={colors.info} />
          {provider.offersDistance && <Badge label={t('explore.distance')} color={colors.success} />}
        </View>

        <View style={styles.actions}>
          {provider.phone && <Button title={t('explore.call')} variant="primary" onPress={() => open(`tel:${provider.phone}`)} />}
          {provider.email && (
            <Button title={t('explore.email')} variant="outline" onPress={() => open(`mailto:${provider.email}`)} />
          )}
          {provider.website && (
            <Button title={t('explore.visitWebsite')} variant="ghost" onPress={() => open(provider.website!)} />
          )}
        </View>

        <SectionTitle>{t('explore.relatedQualifications')}</SectionTitle>
        {provider.qualificationIds.map((qid) => {
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
  badges: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md, flexWrap: 'wrap' },
  actions: { gap: spacing.sm, marginBottom: spacing.lg },
  link: { marginBottom: spacing.sm, backgroundColor: colors.surface },
  linkTitle: { ...typography.label, fontSize: 15 },
  linkSub: { ...typography.caption, marginTop: 2 },
});
