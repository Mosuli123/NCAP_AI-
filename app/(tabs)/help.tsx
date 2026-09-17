import React from 'react';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Badge, Button, Card, SectionTitle } from '@/components/ui';
import { adviceContacts, careerEvents } from '@/data';
import { colors, spacing, typography } from '@/theme';

/**
 * "Get Help" — surfaces NCAP's careers-advice directory, Khetha contact
 * channels (call centre, practitioners, walk-in centres) and career events, so
 * a user can always reach a human practitioner. A prominent helpline button
 * sits at the top for the lowest-friction path to assistance.
 */
export default function HelpScreen() {
  const { t } = useTranslation();
  const helpline = adviceContacts.find((c) => c.channel === 'Call Centre');

  const open = (url: string) => Linking.openURL(url).catch(() => undefined);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.intro}>{t('help.intro')}</Text>

      {helpline?.phone && (
        <Card style={styles.helplineCard}>
          <Text style={styles.helplineName}>{helpline.name}</Text>
          <Text style={styles.helplineNumber}>{helpline.phone}</Text>
          <View style={{ height: spacing.sm }} />
          <Button
            title={t('help.callHelpline')}
            variant="accent"
            onPress={() => open(`tel:${helpline.phone?.replace(/\s/g, '')}`)}
          />
        </Card>
      )}

      <SectionTitle>{t('help.contacts')}</SectionTitle>
      {adviceContacts.map((c) => (
        <Card key={c.id} style={styles.contactCard}>
          <View style={styles.contactHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.contactName}>{c.name}</Text>
              <Text style={styles.contactRole}>{c.role}</Text>
            </View>
            <Badge label={c.channel} color={colors.primary} />
          </View>
          <View style={styles.contactActions}>
            {c.phone && <Button title={t('explore.call')} fullWidth={false} variant="outline" onPress={() => open(`tel:${c.phone?.replace(/\s/g, '')}`)} />}
            {c.email && <Button title={t('explore.email')} fullWidth={false} variant="ghost" onPress={() => open(`mailto:${c.email}`)} />}
            {c.whatsapp && (
              <Button
                title="WhatsApp"
                fullWidth={false}
                variant="ghost"
                onPress={() => open(`https://wa.me/${c.whatsapp?.replace(/[^0-9]/g, '')}`)}
              />
            )}
          </View>
        </Card>
      ))}

      <SectionTitle>{t('help.events')}</SectionTitle>
      {careerEvents.map((e) => (
        <Card key={e.id} style={styles.eventCard}>
          <View style={styles.eventHeader}>
            <Text style={styles.eventDate}>{new Date(e.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</Text>
            <Badge label={e.virtual ? t('help.virtual') : t('help.inPerson')} color={e.virtual ? colors.info : colors.success} />
          </View>
          <Text style={styles.eventTitle}>{e.title}</Text>
          <Text style={styles.eventLocation}>{e.location}</Text>
          <Text style={styles.eventDesc}>{e.description}</Text>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  intro: { ...typography.bodyMuted, marginBottom: spacing.md },
  helplineCard: { backgroundColor: colors.primary, marginBottom: spacing.lg },
  helplineName: { ...typography.label, color: colors.textInverse },
  helplineNumber: { ...typography.h1, color: colors.textInverse, marginTop: spacing.xs },
  contactCard: { marginBottom: spacing.sm },
  contactHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  contactName: { ...typography.label, fontSize: 15 },
  contactRole: { ...typography.caption, marginTop: 2 },
  contactActions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm, flexWrap: 'wrap' },
  eventCard: { marginBottom: spacing.sm },
  eventHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  eventDate: { ...typography.label, color: colors.primary },
  eventTitle: { ...typography.h3, fontSize: 17 },
  eventLocation: { ...typography.caption, marginTop: 2 },
  eventDesc: { ...typography.bodyMuted, marginTop: spacing.sm, lineHeight: 22 },
});
