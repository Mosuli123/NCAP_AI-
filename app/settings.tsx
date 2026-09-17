import { router } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button, Card, Chip, SectionTitle } from '@/components/ui';
import { SUPPORTED_LANGUAGES, changeLanguage } from '@/i18n';
import { signOut } from '@/services/auth';
import { cancelAllReminders, requestNotificationPermission, scheduleJourneyReminder } from '@/services/notifications';
import { StorageKeys, removeItem } from '@/services/storage';
import { useProfile } from '@/store/ProfileContext';
import { colors, spacing, typography } from '@/theme';
import type { SupportedLanguage } from '@/types';

/**
 * Settings: language selection, notification consent toggle, POPIA-aligned
 * data controls (delete all data), and an About section describing the app's
 * relationship to DHET's NCAP.
 */
export default function Settings() {
  const { t, i18n } = useTranslation();
  const { profile, setBasics, setConsent, resetProfile } = useProfile();

  const pickLanguage = (lang: SupportedLanguage) => {
    changeLanguage(lang);
    setBasics({ language: lang });
  };

  const toggleNotifications = async (enabled: boolean) => {
    setConsent({ notifications: enabled });
    if (enabled) {
      const granted = await requestNotificationPermission();
      if (granted) await scheduleJourneyReminder(60 * 60 * 24, t('home.subtitle'));
    } else {
      await cancelAllReminders();
    }
  };

  const confirmDelete = () => {
    Alert.alert(t('settings.deleteData'), t('settings.deleteConfirm'), [
      { text: t('common.back'), style: 'cancel' },
      {
        text: t('settings.deleteData'),
        style: 'destructive',
        onPress: async () => {
          await resetProfile();
          await signOut();
          await removeItem(StorageKeys.onboardingDone);
          await removeItem(StorageKeys.guestMode);
          await cancelAllReminders();
          router.replace('/onboarding');
        },
      },
    ]);
  };

  const confirmSignOut = () => {
    Alert.alert(t('settings.signOut'), t('settings.signOutConfirm'), [
      { text: t('common.back'), style: 'cancel' },
      {
        text: t('settings.signOut'),
        onPress: async () => {
          await signOut();
          await removeItem(StorageKeys.guestMode);
          router.replace('/login');
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <SectionTitle>{t('settings.language')}</SectionTitle>
      <View style={styles.langGrid}>
        {SUPPORTED_LANGUAGES.map((l) => (
          <Chip key={l.code} label={l.nativeLabel} selected={i18n.language === l.code} onPress={() => pickLanguage(l.code)} />
        ))}
      </View>

      <SectionTitle>{t('settings.notifications')}</SectionTitle>
      <Card style={styles.row}>
        <Text style={styles.rowLabel}>{t('onboarding.consentNotifications')}</Text>
        <Switch
          value={profile.consent.notifications}
          onValueChange={toggleNotifications}
          trackColor={{ true: colors.primaryLight, false: colors.border }}
          thumbColor={profile.consent.notifications ? colors.primary : '#f4f3f4'}
          accessibilityLabel={t('settings.notifications')}
        />
      </Card>

      <SectionTitle>{t('settings.privacy')}</SectionTitle>
      <Card style={styles.privacyCard}>
        <Text style={styles.privacyBody}>{t('onboarding.consentBody')}</Text>
        <View style={{ height: spacing.md }} />
        <Button title={t('settings.deleteData')} variant="outline" onPress={confirmDelete} />
      </Card>

      <SectionTitle>{t('settings.account')}</SectionTitle>
      <Card style={styles.privacyCard}>
        <Text style={styles.rowLabel}>
          {profile.displayName ? `${t('home.greeting')}, ${profile.displayName}` : t('home.greetingGuest')}
        </Text>
        <View style={{ height: spacing.md }} />
        <Button title={t('settings.signOut')} variant="outline" onPress={confirmSignOut} />
      </Card>

      <SectionTitle>{t('settings.about')}</SectionTitle>
      <Card>
        <Text style={styles.aboutBody}>{t('settings.aboutBody')}</Text>
        <Text style={styles.version}>Khetha NCAP · v1.0.0</Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  langGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg },
  rowLabel: { ...typography.body, flex: 1 },
  privacyCard: { backgroundColor: colors.surface, marginBottom: spacing.lg },
  privacyBody: { ...typography.bodyMuted, lineHeight: 22 },
  aboutBody: { ...typography.body, lineHeight: 22 },
  version: { ...typography.caption, marginTop: spacing.md },
});
